// Imports the Google Cloud client libraries

const vision = require('@google-cloud/vision').v1;
import fs from 'fs/promises';

import { Point, BoundingBox, getDistance, getAverage, getBoundingBoxSize } from './geometry';

function assert(value: unknown) {
	if (!value) throw 'An error occoured';
}

//
// Types
//

/** A word or short sentence detected by OCR in a page */
export class Word {
	constructor(text: string, bbox: BoundingBox, confidence: number) {
		this.text = text;
		this.bbox = bbox;
		this.confidence = confidence;
	}

	/** Text in this word */
	text: string;

	/** Bounding box of this word or sentence */
	bbox: BoundingBox;

	/** OCR confidence in this text (0 to 1) */
	confidence: number;
}

/** A language code and its detection confidence */
export type Language = { languageCode: string; confidence: number };

/** A page in a report document, contains OCR results, metadata, etc */
export class Page {
	constructor(pageNumber: number, width: number, height: number, languages: Language[], words: Word[], text: string) {
		this.pageNumber = pageNumber;
		this.width = width;
		this.height = height;
		this.languages = languages;
		this.words = words;
		this.text = text;
	}

	/** Page number in the document (1 based) */
	pageNumber: number;

	/** Languages detected by OCR and confidence */
	languages: Language[];

	/** Page's height in its own coordinate system */
	width: number;

	/** Page's height in its own coordinate system */
	height: number;

	/** Individual words or short sentences in the page */
	words: Word[];

	/** Text in the page */
	text: string;
}

/** A report inclusive of a number of pages, OCR information, metadata, etc */
export class Report {
	constructor(pages: Page[]) {
		this.pages = pages;
	}

	/** Pages in this report with fulltext, OCR words, etc */
	pages: Page[];
}

//
// Google Vision
//

// create a google vision client located in the EU
const imageAnnotatorClientOptions = { apiEndpoint: 'eu-vision.googleapis.com' };
const imageAnnotatorClient = new vision.ImageAnnotatorClient(imageAnnotatorClientOptions);

/**
 * Calls Google Vision APIs to perform OCR on a pdf document and return annotations
 * @see https://console.cloud.google.com/apis/library/vision.googleapis.com
 * @see https://cloud.google.com/vision/docs/pdf
 * @param sourceUri Url of a pdf document in google storage gs:// or local path
 * @returns The response from Google Vision APIs
 */
export async function getGoogleVisionAnnotations(sourceUri: string): Promise<any> {
	try {
		let inputConfig;
		if (sourceUri.startsWith('gs://')) {
			// reading a file stored in an accessible google storage bucket
			// supported mime_types are: 'application/pdf' and 'image/tiff'
			inputConfig = { mimeType: 'application/pdf', gcsSource: { uri: sourceUri } };
		} else {
			// read file from local filesystem and send along with request to annotate
			inputConfig = { mimeType: 'application/pdf', content: await fs.readFile(sourceUri) };
		}

		// make the synchronous batch request, process the results
		// just get the first result since only one file was sent
		const [result] = await imageAnnotatorClient.batchAnnotateFiles({
			requests: [{ inputConfig, features: [{ type: 'DOCUMENT_TEXT_DETECTION' }] }],
		});

		assert(result.responses[0].responses);
		return result.responses[0].responses;
	} catch (exception) {
		console.error(exception);
		throw exception;
	}
}

/**
 * Takes a google vision fullTextAnnotation response and converts it to
 * an internal format that we use we block and paragraph information is
 * dropped and everything is converted to pages and words on page.
 * @param responses The original google vision response from getGoogleVisionAnnotations
 * @returns A normalized and simplified version of the annotations
 */
export async function normalizeGoogleVisionAnnotations(responses: any): Promise<Report> {
	const pages: Page[] = [];
	for (const response of responses) {
		assert(!response.error);
		// https://cloud.google.com/vision/docs/reference/rest/v1/AnnotateImageResponse#TextAnnotation
		const fullTextAnnotation = response.fullTextAnnotation;
		const page = fullTextAnnotation.pages[0];
		assert(fullTextAnnotation.pages.length == 1);
		assert(page.width > 0 && page.height > 0);

		const words: Word[] = [];
		for (const block of page.blocks) {
			// skipping blocks as they are huge and useless
			for (const paragraph of block.paragraphs) {
				// skipping paragraphs as they are quite large and useless
				for (const word of paragraph.words) {
					let word_text = '';
					for (const symbol of word.symbols) {
						word_text += symbol.text;

						// is there a space or other break?
						if (symbol.property?.detectedBreak) {
							// https://cloud.google.com/vision/docs/reference/rest/v1/AnnotateImageResponse#breaktype
							let breakSymbol = null;
							switch (symbol.property?.detectedBreak?.type) {
								case 'SPACE':
									breakSymbol = ' ';
									break;
								case 'SURE_SPACE':
									breakSymbol = '  ';
									break;
								case 'LINE_BREAK':
									breakSymbol = '\n';
									break;
							}
							if (breakSymbol) {
								if (symbol.property.detectedBreak.isPrefix) word_text = breakSymbol + word_text;
								else word_text += breakSymbol;
							}
						}
					}

					words.push({
						text: word_text,
						bbox: word.boundingBox.normalizedVertices,
						confidence: word.confidence,
					});
				}
			}
		}

		pages.push({
			pageNumber: response.context.pageNumber,
			width: page.width,
			height: page.height,
			languages: page.property?.detectedLanguages.slice(0, 3), // keep only most likely
			words: words,
			text: fullTextAnnotation.text,
		});
	}

	const report: Report = {
		pages,
	};

	return report;
}

//
// further processing of ocr results...
//

/**
 * Merge words in a sentence or sequence into a single word
 * @param page Annotations for a specific page
 * @returns Number of words that have been merged
 */
function mergeWords(page: Page): number {
	if (!page.words) {
		console.warn(`mergeWords - page ${page} has no words`, page);
		return 0;
	}

	// TODO could sort words by x position to make sure joined words are in proper order
	let merged = 0;

	for (let i = 0; i < page.words.length; i++) {
		const word1 = page.words[i];
		if (word1) {
			const lineHeight = getDistance(word1.bbox[1], word1.bbox[2]);
			const xTolerance = lineHeight * 0.8; // distance between words up to 80% of line height

			for (let j = 0; j < page.words.length; j++) {
				if (i != j) {
					const word2 = page.words[j];
					if (word2) {
						const canMerge =
							// words on the same line?
							areWordsOnSameLine(word1, word2) &&
							// horizontal distance between top of words within range?
							getDistance(word1.bbox[1], word2.bbox[0]) < xTolerance &&
							// horizontal distance between bottom of words within range?
							getDistance(word1.bbox[2], word2.bbox[3]) < xTolerance;

						if (canMerge) {
							// weighted confidence level
							const l1 = word1.text.length;
							const l2 = word2.text.length;
							word1.confidence = (word1.confidence * l1 + word2.confidence * l2) / (l1 + l2);

							// merge words
							word1.text += word2.text;

							// enlarge word's bounding box to include second word
							word1.bbox[1] = word2.bbox[1];
							word1.bbox[2] = word2.bbox[2];

							// remove second word
							page.words.splice(j, 1);

							// reprocess first word
							i--;
							merged++;
							break;
						}
					}
				}
			}
		}
	}

	// remove whitespace after joining
	for (const word of page.words) {
		word.text = word.text.trim();
	}

	return merged;
}

/** Returns true if both words can be considered part of the same line */
function areWordsOnSameLine(word1: Word, word2: Word): boolean {
	if (word1 && word2) {
		const yMiddle = getAverage(...word1.bbox).y;

		// TODO instead of considering words to be on horizontal lines, could deal with lines at an angle
		return word2.bbox[0].y < yMiddle && word2.bbox[1].y < yMiddle && word2.bbox[2].y > yMiddle && word2.bbox[3].y > yMiddle;
	}

	return false;
}

/** Group words (or small fragments) into arrays that belong to the same line on the document */
function groupWordsByLine(words: Word[]): Word[][] {
	// sort words top to bottom
	words = [...words];
	words.sort((a, b) => getAverage(...a.bbox).y - getAverage(...b.bbox).y);

	const lines = Array<Word[]>();
	for (let i = 0; i < words.length; i++) {
		const word1 = words[i];
		if (word1) {
			const line = Array<Word>(word1);
			lines.push(line);
			for (let j = i + 1; j < words.length; j++) {
				const word2 = words[j];
				if (word2 && areWordsOnSameLine(word1, word2)) {
					line.push(word2);
					words.splice(j, 1);
					j--;
				}
			}
		}
	}

	// sort lines left to right
	lines.forEach((line) => {
		line.sort((a, b) => getAverage(...a.bbox).x - getAverage(...b.bbox).x);
	});

	return lines;
}

export async function processAnnotations(report: Report) {
	for (const page of report.pages) {
		// first merge words into short sentences or little chunks of text
		const mergedWords = mergeWords(page);
		console.log(`processAnnotations - page: ${page.pageNumber}, merged: ${mergedWords} words`);
	}

	// TODO find words that could match this document to an existing template
	// look on all pages although we're most likely to find headers on page 1

	// find items on lines that seem to be formatted in a table-ish manner
	for (const page of report.pages) {
		// group words that are on the same line
		const lines = groupWordsByLine(page.words);
		console.log(`processAnnotations - page: ${page.pageNumber} has ${lines.length} lines`);

		// see if the group of words contains:
		// 1 item that could be mapped to a biomarker
		// 1 item that could be mapped to a quantity
		// 1 item that could be mapped to measurements units (optional)
		// 1 item that could be mapped to suggested range (optional)

		// if biomarker name + quantity, add to list of possible biomarkers
		// if has units and/or range, add properties, raise confidence
	}
}

//
// Render to html for debugging, development
//

function htmlEntities(str?: string) {
	if (str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}
	return null;
}

function bboxToSvg(bbox: BoundingBox, w: number, h: number, tooltip?: string) {
	if (bbox) {
		const v = [
			(bbox[0].x * w).toFixed(4), // top left
			(bbox[0].y * h).toFixed(4),
			(bbox[1].x * w).toFixed(4), // top right
			(bbox[1].y * h).toFixed(4),
			(bbox[2].x * w).toFixed(4), // bottom right
			(bbox[2].y * h).toFixed(4),
			(bbox[3].x * w).toFixed(4), // bottom left
			(bbox[3].y * h).toFixed(4),
		];
		return `<polygon points='${v[0]},${v[1]} ${v[2]},${v[3]} ${v[4]},${v[5]} ${v[6]},${v[7]}' class='word'><title>'${htmlEntities(
			tooltip
		)}'</title></polygon>\n`;
	}
	return '';
}

/**
 * Converts annotations to an html page for debugging and development
 * @param annotations Annotations generated by normalizeGoogleVisionAnnotations
 * @param pageNumber Page number is 1 based
 * @returns A simple html page with an svg image showing words in the document
 */
export function annotationsToHtml(annotations: any, pageNumber?: number): string {
	const page = annotations.pages[(pageNumber || 1) - 1];

	let svg = '';
	for (const word of page.words) {
		svg += bboxToSvg(word.bbox, page.width, page.height, word.text);
	}

	svg = `<html><head><style>.word {fill: red; fill-opacity: .1; stroke: green; stroke-width: 1; stroke-opacity: .5;}</style></head>\
    <body><svg height='${page.height}' width='${page.width}'>${svg}</svg></body></html>`;
	return svg;
}
