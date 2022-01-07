// Imports the Google Cloud client libraries

const vision = require('@google-cloud/vision').v1;
import fs from 'fs/promises';
import { text } from 'stream/consumers';

function assert(value: unknown) {
	if (!value) throw 'An error occoured';
}

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
export async function normalizeGoogleVisionAnnotations(responses: any) {
	// https://cloud.google.com/vision/docs/reference/rest/v1/AnnotateImageResponse#TextAnnotation
	const normalized = { pages: new Array<any>() };

	for (const response of responses) {
		assert(!response.error);
		const normalizedPage: any = {};
		normalized.pages.push(normalizedPage);

		const fullTextAnnotation = response.fullTextAnnotation;
		const page = fullTextAnnotation.pages[0];
		assert(fullTextAnnotation.pages.length == 1);
		assert(page.width > 0 && page.height > 0);

		normalizedPage.pageNumber = response.context.pageNumber;
		normalizedPage.detectedLanguages = page?.property?.detectedLanguages.slice(0, 3);
		normalizedPage.text = fullTextAnnotation.text;
		normalizedPage.width = page.width;
		normalizedPage.height = page.height;
		normalizedPage.words = new Array();

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

					normalizedPage.words.push({
						text: word_text,
						bbox: word.boundingBox.normalizedVertices,
						confidence: word.confidence.toFixed(3),
					});
				}
			}
		}
	}

	return normalized;
}

//
// further processing of ocr results...
//

function getBoundingBoxSize(bbox: any) {
	const xMax = Math.max(bbox[0].x, bbox[1].x, bbox[2].x, bbox[3].x);
	const xMin = Math.min(bbox[0].x, bbox[1].x, bbox[2].x, bbox[3].x);
	const yMax = Math.max(bbox[0].y, bbox[1].y, bbox[2].y, bbox[3].y);
	const yMin = Math.min(bbox[0].y, bbox[1].y, bbox[2].y, bbox[3].y);
	return { width: xMax - xMin, height: yMax - yMin };
}

function canMergeWords(word1: any, word2: any): boolean {
	if (word1.text.length > 0) {
		const size1 = getBoundingBoxSize(word1.bbox);
		const spaceWidth = size1.height * 0.7;

		const d1 = getPointsDistance(word1.bbox[1], word2.bbox[0]);
		const d2 = getPointsDistance(word1.bbox[2], word2.bbox[3]);
		if (d1 < spaceWidth && d2 < spaceWidth) {
			return true;
		}
	}

	return false;
}

function getPointsDistance(p1: any, p2: any): number {
	const dx = p1.x - p2.x;
	const dy = p1.y - p2.y;
	return Math.sqrt(dx * dx + dy * dy);
}

/** Returns the distance of p0 from the line formed by p1 and p2 */
function getDistanceFromLine(p1: any, p2: any, p0: any): number {
	return (
		Math.abs((p2.y - p1.y) * p0.x - (p2.x - p1.x) * p0.y + p2.x * p1.y - p2.y * p1.x) /
		Math.pow(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2), 0.5)
	);
}

function getWordsDistance(word1: any, word2: any): number {
	const size1 = getBoundingBoxSize(word1.bbox);

	const p1 = { x: (word1.bbox[0].x + word1.bbox[3].x) / 2, y: (word1.bbox[0].y + word1.bbox[3].y) / 2 };
	const p2 = { x: (word1.bbox[1].x + word1.bbox[2].x) / 2, y: (word1.bbox[1].y + word1.bbox[2].y) / 2 };
	const p0 = { x: (word2.bbox[0].x + word2.bbox[3].x) / 2, y: (word1.bbox[0].y + word1.bbox[3].y) / 2 };

	const alignment = getDistanceFromLine(p1, p2, p0);
	if (alignment < size1.width * 0.5 && p0.x > p2.x) {
		return getPointsDistance(p2, p0);
	}

	return Number.POSITIVE_INFINITY;
}

/**
 * Merge words in a sentence or sequence into a single word
 * @param page Annotations for a specific page
 * @returns Number of words that have been merged
 */
function mergeWords(page: any): number {
	// TODO could sort words by x position to make sure joined words are in proper order
	let merged = 0;

	for (let i = 0; i < page.words.length; i++) {
		const word1 = page.words[i];

		const lineHeight = getPointsDistance(word1.bbox[1], word1.bbox[2]);
		const xTolerance = lineHeight * 0.8; // distance between words up to 80% of line height
		const yTolerance = lineHeight * 0.4; // vertical distance between lines max 40% of line height

		for (let j = 0; j < page.words.length; j++) {
			if (i != j) {
				const word2 = page.words[j];

				const canMerge =
					// topRight of first and topLeft of second word more or less in line?
					Math.abs(word1.bbox[1].y - word2.bbox[0].y) < yTolerance &&
					// bottomRight of first and bottomLeft of second word more or less in line?
					Math.abs(word1.bbox[2].y - word2.bbox[3].y) < yTolerance &&
					// horizontal distance between words within range?
					getPointsDistance(word1.bbox[1], word2.bbox[0]) < xTolerance &&
					getPointsDistance(word1.bbox[2], word2.bbox[3]) < xTolerance;

				if (canMerge) {
					// merge words
					word1.confidence = (word1.confidence * word1.text.length + word2.confidence * word2.text.length) / (word1.text.length + word2.text.length);
					word1.text += word2.text;

					// enlarge word's bounding box to include second word
					word1.bbox[1] = word2.bbox[1];
					word1.bbox[2] = word2.bbox[2];

					// remove merged word
					page.words.splice(j, 1);

					// process word1 again
					i--;
					merged++;
					break;
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

export async function processAnnotations(annotations: any) {
	for (const page of annotations.pages) {
		const mergedWords = mergeWords(page);
		console.log(`processAnnotations - page: ${page.pageNumber}, merged: ${mergedWords} words`);
	}
}

function htmlEntities(str?: string) {
	if (str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}
	return null;
}

function bboxToSvg(bbox: any, w: number, h: number, tooltip?: string) {
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
