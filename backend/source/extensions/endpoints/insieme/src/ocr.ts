//
// ocr.ts - optical character recognition via Google Vision
//

import assert from 'assert/strict';
const vision = require('@google-cloud/vision').v1;
import fs from 'fs/promises';

import { BoundingBox, getDistance, getAverage, getBoundingBoxSize } from './geometry';
import { Metadata } from './metadata';

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

/** Returns true if both words can be considered part of the same line */
function words_areOnSameLine(word1: Word, word2: Word): boolean {
	if (word1 && word2) {
		const yMiddle = getAverage(...word1.bbox)[1];

		// TODO instead of considering words to be on horizontal lines, could deal with lines at an angle
		return word2.bbox[0][1] < yMiddle && word2.bbox[1][1] < yMiddle && word2.bbox[2][1] > yMiddle && word2.bbox[3][1] > yMiddle;
	}

	return false;
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

	//
	// public methods
	//

	/** Remove words that are not horizontal, too large, too small, etc */
	public cleanupWords(): number {
		let cleaned = 0;
		for (let i = 0; i < this.words.length; i++) {
			const word = this.words[i];
			if (word) {
				const wordHeight = getBoundingBoxSize(word.bbox).height;
				const leftMidY = word.bbox[0][1] + word.bbox[3][1];
				const rightMidY = word.bbox[1][1] + word.bbox[2][1];

				// TODO could look at angle rather than absolute difference
				if (Math.abs(leftMidY - rightMidY) > wordHeight * 0.5) {
					console.debug(`cleanupWords - removing '${word.text}' because word is not horizontal`);
					cleaned++;
					this.words.splice(i, 1);
					i--;
				}
			}
		}

		console.debug(`cleanupWords - page: ${this.pageNumber}, cleaned: ${cleaned} words`);
		return cleaned;
	}

	/**
	 * Merge words in a sentence or sequence into a single word
	 * @param page Annotations for a specific page
	 * @returns Number of words that have been merged
	 */
	public mergeWords(): number {
		if (!this.words) {
			console.warn(`mergeWords - page ${this} has no words`, this);
			return 0;
		}

		let merged = 0;
		for (let i = 0; i < this.words.length; i++) {
			const word1 = this.words[i];
			if (word1) {
				const lineHeight = getDistance(word1.bbox[1], word1.bbox[2]);
				const xTolerance = lineHeight * 0.8; // distance between words up to 80% of line height

				for (let j = 0; j < this.words.length; j++) {
					if (i != j) {
						const word2 = this.words[j];
						if (word2) {
							const canMerge =
								// words on the same line?
								words_areOnSameLine(word1, word2) &&
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
								this.words.splice(j, 1);

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
		for (const word of this.words) {
			word.text = word.text.trim();
		}

		console.debug(`mergeWords - page: ${this.pageNumber}, merged: ${merged} words`);
		return merged;
	}

	/** Sort words top to bottom and left to right */
	public sortWords() {
		this.words.sort((word1, word2) => {
			if (words_areOnSameLine(word1, word2)) {
				// sort left to right, consider only left edge of bbox
				const x1 = (word1.bbox[0][0] + word1.bbox[3][0]) / 2;
				const x2 = (word2.bbox[0][0] + word2.bbox[3][0]) / 2;
				return x1 - x2;
			}

			// sort top to bottom if not on the same line
			return getAverage(...word1.bbox)[1] - getAverage(...word2.bbox)[1];
		});
	}

	/** Group words (or small fragments) into arrays that belong to the same line on the document */
	public groupWordsIntoLines() {
		let words = [...this.words];
		this.lines = [];
		for (let i = 0; i < words.length; i++) {
			const word1 = words[i];
			if (word1) {
				const line = [word1];
				this.lines.push(line);
				for (let j = i + 1; j < words.length; j++) {
					const word2 = words[j];
					if (word2 && words_areOnSameLine(word1, word2)) {
						line.push(word2);
						words.splice(j, 1);
						j--;
					}
				}
			}
		}
		console.debug(`groupWordsIntoLines - page: ${this.pageNumber} has ${this.lines.length} lines`);
	}
}

//
// Google Vision methods
//

// create a google vision client located in the EU
const imageAnnotatorClientOptions = { apiEndpoint: 'eu-vision.googleapis.com' };
const imageAnnotatorClient = new vision.ImageAnnotatorClient(imageAnnotatorClientOptions);

export class Ocr {
	/**
	 * Calls Google Vision APIs to perform OCR on a pdf document and return annotations
	 * with pages and words on pages plus some document level metadata. Also returns
	 * the raw response from Google Vision which can be used for debugging.
	 * @see https://console.cloud.google.com/apis/library/vision.googleapis.com
	 * @see https://cloud.google.com/vision/docs/pdf
	 * @param sourceUri Url of a pdf document in google storage gs:// or local path
	 * @returns An array of Page objects, plus the raw response from Google Vision APIs
	 */
	static async scanPages(sourceUri: string): Promise<{ pages: Page[]; rawOcr: any; metadata: Metadata }> {
		try {
      console.time("scanPages")
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
      console.timeEnd("scanPages")

			const rawOcr = result.responses[0].responses;
      const pages = Ocr.normalizeAnnotations(rawOcr);
			const metadata = new Metadata({ ocr: { sourceUri, ...imageAnnotatorClientOptions } });

			return { pages, rawOcr, metadata };
		} catch (exception) {
			console.error(`scanPages('${sourceUri}') - exception: ${exception}`, exception);
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
	public static normalizeAnnotations(rawOcr: any): Page[] {
		const pages: Page[] = [];
		for (const response of rawOcr) {
			assert(!response.error, `OCR returned an error: ${response.error}`);
			// https://cloud.google.com/vision/docs/reference/rest/v1/AnnotateImageResponse#TextAnnotation
			const ocrAnnotations = response.fullTextAnnotation;
			const ocrPage = ocrAnnotations.pages[0];
			assert(ocrAnnotations.pages.length == 1, 'OCR returned zero pages');
			assert(ocrPage.width > 0 && ocrPage.height > 0, 'OCR returned empty pages');

			const words: Word[] = [];
			for (const ocrBlock of ocrPage.blocks) {
				// skipping blocks as they are huge and useless
				for (const ocrParagraph of ocrBlock.paragraphs) {
					// skipping paragraphs as they are quite large and useless
					for (const ocrWord of ocrParagraph.words) {
						let word_text = '';
						for (const symbol of ocrWord.symbols) {
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

						const bbox = ocrWord.boundingBox.normalizedVertices.map((a: any) => [a.x, a.y]);
						words.push({ text: word_text, confidence: ocrWord.confidence, bbox: bbox });
					}
				}
			}

			// locale detected with highest confidence on page
			const locale = ocrPage.property?.detectedLanguages[0].languageCode;
			const page = new Page(response.context.pageNumber, ocrPage.width, ocrPage.height, words, ocrAnnotations.text, locale);
			pages.push(page);
		}

		return pages;
	}
}
