//
// ocr.ts - optical character recognition via Google Vision
//

import { strict as assert } from 'assert';
const vision = require('@google-cloud/vision').v1;
import fs from 'fs/promises';
import { BoundingBox, getDistance, getAverage, getBoundingBoxSize, getBoundingBoxAlignments, bboxToString, mergeBoundingBoxes } from './geometry';


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

/** A page in a report document, contains OCR results, metadata, etc */
export class Page {
	constructor(pageNumber: number, width: number, height: number, words: Word[], text: string, locale?: string) {
		this.pageNumber = pageNumber;
		this.width = width;
		this.height = height;
		this.words = words;
		this.text = text;
		this.locale = locale;
	}

	/** Page number in the document (1 based) */
	pageNumber: number;

	/** Page's height in its own coordinate system */
	width: number;

	/** Page's height in its own coordinate system */
	height: number;

	/** Individual words or short sentences in the page */
	words: Word[];

	/** Words grouped by line */
	lines?: Word[][];

	/** Text in the page */
	text: string;

	/** Locale for this page, eg. en_US, it_IT */
	locale?: string;
}

//
// Google Vision methods
//

// create a google vision client located in the EU
const imageAnnotatorClientOptions = { apiEndpoint: 'eu-vision.googleapis.com' };
const imageAnnotatorClient = new vision.ImageAnnotatorClient(imageAnnotatorClientOptions);

/**
 * Calls Google Vision APIs to perform OCR on a pdf document and return annotations
 * with pages and words on pages plus some document level metadata. Also returns
 * the raw response from Google Vision which can be used for debugging.
 * @see https://console.cloud.google.com/apis/library/vision.googleapis.com
 * @see https://cloud.google.com/vision/docs/pdf
 * @param sourceUri Url of a pdf document in google storage gs:// or local path
 * @returns An array of Page objects, plus the raw response from Google Vision APIs
 */
export async function getOcrAnnotations(sourceUri: string): Promise<{ pages: Page[]; rawOcr: any }> {
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

		const rawOcr = result.responses[0].responses;
		const pages = normalizeOcrAnnotations(rawOcr);
		return { pages, rawOcr };
	} catch (exception) {
		console.error(`getOcrAnnotations('${sourceUri}') - exception: ${exception}`, exception);
		throw exception;
	}
}

/**
 * Takes a google vision fullTextAnnotation response and converts it to
 * an internal format that we use where block and paragraph information is
 * dropped and everything is converted to pages and words on pages.
 * @param rawOcr The original google vision response from getOcrAnnotations
 * @returns A normalized and simplified version of the annotations
 */
export function normalizeOcrAnnotations(rawOcr: any): Page[] {
	const pages: Page[] = [];
	for (const response of rawOcr) {
		assert(!response.error, `OCR returned an error: ${response.error}`);
		// https://cloud.google.com/vision/docs/reference/rest/v1/AnnotateImageResponse#TextAnnotation
		const fullTextAnnotation = response.fullTextAnnotation;
		const page = fullTextAnnotation.pages[0];
		assert(fullTextAnnotation.pages.length == 1, 'OCR returned zero pages');
		assert(page.width > 0 && page.height > 0, 'OCR returned empty pages');

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

					const bbox = word.boundingBox.normalizedVertices.map((a: any) => [a.x, a.y]);
					words.push({ text: word_text, confidence: word.confidence, bbox: bbox });
				}
			}
		}

		// locale detected with highest confidence on page
		const locale = page.property?.detectedLanguages[0].languageCode

		pages.push({
			pageNumber: response.context.pageNumber,
			width: page.width,
			height: page.height,
			words: words,
			text: fullTextAnnotation.text,
			locale
		});
	}

	return pages;
}
