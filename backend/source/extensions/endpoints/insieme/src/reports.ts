// Imports the Google Cloud client libraries

const vision = require('@google-cloud/vision').v1;
import fs from 'fs/promises';

// https://fusejs.io/api/methods.html
import Fuse from 'fuse.js';

import { BoundingBox, getDistance, getAverage, getBoundingBoxSize, getBoundingBoxAlignments, bboxToString, mergeBoundingBoxes } from './geometry';
import { Unit } from "./units"
import { searchBiomarkers, parseRange, parseValue, parseUnits } from './biomarkers';
import { stringify } from 'querystring';

import assert from "assert/strict"
import { Page, Word} from "./ocr"

//
// Types
//


/** A report inclusive of a number of pages, OCR information, metadata, etc */
export class Report {
	constructor(pages: Page[]) {
		this.pages = pages;
	}

	/** Pages in this report with fulltext, OCR words, etc */
	pages: Page[];

	/** Biomarker results detected in this report */
	results?: any[];

	extras?: any;

	//
	// static methods
	//

	public async generateOcr(url: string, analyze: boolean = true) {


	}

	public async analyzeOcr() {
		for (const page of this.pages) {
			// remove words which aren't horizontal or are too small, etc
			words_cleanup(page);
			// merge words into short sentences or little chunks of text
			words_merge(page);
			// sort top to bottom, left to right
			words_sort(page.words);
		}
	
		// TODO find words that could match this document to an existing template
		// look on all pages although we're most likely to find headers on page 1
	
		// find items on lines that seem to be formatted in a table-ish manner
		for (const page of this.pages) {
			// group words that are on the same line
			const lines = words_groupByLine(page.words);
			console.debug(`words_groupByLine - page: ${page.pageNumber} has ${lines.length} lines`);
	
			page.lines = lines;
	
			// see if the group of words contains:
			// 1 item that could be mapped to a biomarker
			// 1 item that could be mapped to a quantity
			// 1 item that could be mapped to measurements units (optional)
			// 1 item that could be mapped to suggested range (optional)
	
			// if biomarker name + quantity, add to list of possible biomarkers
			// if has units and/or range, add properties, raise confidence
		}
	
		await biomarkers_detect(this);
	}
}

//
// Words - cleaning, merging, organizing in lines, etc.
//

/** Remove words that are not horizontal, too large, too small, etc */
function words_cleanup(page: Page): number {
	let cleaned = 0;
	for (let i = 0; i < page.words.length; i++) {
		const word = page.words[i];
		if (word) {
			const wordHeight = getBoundingBoxSize(word.bbox).height;
			const leftMidY = word.bbox[0][1] + word.bbox[3][1];
			const rightMidY = word.bbox[1][1] + word.bbox[2][1];

			// TODO could look at angle rather than absolute difference
			if (Math.abs(leftMidY - rightMidY) > wordHeight * 0.5) {
				console.debug(`words_clean - removing '${word.text}' because word is not horizontal`);
				cleaned++;
				page.words.splice(i, 1);
				i--;
			}
		}
	}

	console.debug(`words_clean - page: ${page.pageNumber}, cleaned: ${cleaned} words`);
	return cleaned;
}

/**
 * Merge words in a sentence or sequence into a single word
 * @param page Annotations for a specific page
 * @returns Number of words that have been merged
 */
function words_merge(page: Page): number {
	if (!page.words) {
		console.warn(`words_merge - page ${page} has no words`, page);
		return 0;
	}

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

	console.debug(`words_merge - page: ${page.pageNumber}, merged: ${merged} words`);
	return merged;
}

/** Sort words top to bottom and left to right */
function words_sort(words: Word[]) {
	words.sort((word1, word2) => {
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

/** Returns true if both words can be considered part of the same line */
function words_areOnSameLine(word1: Word, word2: Word): boolean {
	if (word1 && word2) {
		const yMiddle = getAverage(...word1.bbox)[1];

		// TODO instead of considering words to be on horizontal lines, could deal with lines at an angle
		return word2.bbox[0][1] < yMiddle && word2.bbox[1][1] < yMiddle && word2.bbox[2][1] > yMiddle && word2.bbox[3][1] > yMiddle;
	}

	return false;
}

/** Group words (or small fragments) into arrays that belong to the same line on the document */
function words_groupByLine(words: Word[]): Word[][] {
	words = [...words];
	const lines = Array<Word[]>();
	for (let i = 0; i < words.length; i++) {
		const word1 = words[i];
		if (word1) {
			const line = Array<Word>(word1);
			lines.push(line);
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

	return lines;
}

//
// Biomarkers - detecting in reports, etc.
//

const BIOMARKERS_SEARCH_CONFIDENCE = 0.7;
const UNITS_SEARCH_CONFIDENCE = 0.7;

async function biomarkers_detect(report: Report) {
	const results = [];
	const warnings: { message: string; pageNumber?: number; bbox?: BoundingBox }[] = [];

	for (const page of report.pages) {
		// determine which words on the page could be possible biomarker labels,
		// measurement units, values and ranges of values. then see if these words
		// are aligned. since biomarkers are often in table format, we should find
		// that some of these are aligned for example on the left (for names) or
		// on the right (for values) or center (ranges), etc.
		const biomarkersWords = [];
		const unitsWords = [];
		const rangesWords = [];
		const valuesWords = [];

		for (const word of page.words) {
			const biomarkersMatches = await searchBiomarkers(word.text, BIOMARKERS_SEARCH_CONFIDENCE);
			if (biomarkersMatches.length > 0) {
				biomarkersWords.push(word);
			}
			const unitsMatches = Unit.searchUnits(word.text);
			if (unitsMatches.length > 0) {
				unitsWords.push(word);
			}
			if (parseValue(word.text)) {
				valuesWords.push(word);
			}
			if (parseRange(word.text)) {
				rangesWords.push(word);
			}
		}

		// determine if each category of words has a main alignment (column)
		// console.debug('unitsBoxes', unitsWords.map((w) => bboxToString(w.bbox)).join(', '));
		// console.debug('rangesBoxes', rangesWords.map((w) => bboxToString(w.bbox)).join(', '));
		const biomarkersAlign = getBoundingBoxAlignments(biomarkersWords.map((w) => w.bbox));
		const unitsAlign = getBoundingBoxAlignments(unitsWords.map((w) => w.bbox));
		const rangesAlign = getBoundingBoxAlignments(rangesWords.map((w) => w.bbox));
		const valueAlign = getBoundingBoxAlignments(valuesWords.map((w) => w.bbox));

		if (page.lines) {
			for (const line of page.lines) {
				if (line && line[0]) {
					const biomarkersMatches = await searchBiomarkers(line[0].text, BIOMARKERS_SEARCH_CONFIDENCE);
					if (biomarkersMatches.length > 0 && biomarkersMatches[0]) {
						const item = biomarkersMatches[0].item;
						const itemConfidence = biomarkersMatches[0].confidence;
						const itemWord = line[0];

						console.debug(`biomarkers_detect - text: ${line[0].text}, id: ${item.id}/${item.translations[0].name}, confidence: ${itemConfidence}`);

						// find compatible measurement unit on the same line
						let units = null;
						for (const word of line) {
							const u = parseUnits(word.text, item);
							if (u && (units == null || units.confidence < u.confidence)) {
								units = { ...u, word };
							}
						}

						let range = null;
						for (const word of line) {
							const r = parseRange(word.text);
							// TODO or this range is closer to range's column than previous match
							if (r && range == null) {
								range = { ...r, word };
							}
						}

						let value = null;
						for (const word of line) {
							if (!range || word != range.word) {
								const v = parseValue(word.text);
								// TODO this value is closer to value's column than previous value
								if (v && value == null) {
									value = { ...v, word };
								}
							}
						}

						if (value != null) {
							const bbox = mergeBoundingBoxes(line.map((w) => w.bbox));

							// add entry for this biomarker results with units, etc
							const result = {
								id: item.id,
								name: item.translations[0].name,
								value: value.value / (units?.conversion || 1),
								units: item.units?.id,
								extras: {
									original:
										item.units && units && item.units.id != units.id
											? {
													units: units.id,
													value: value.value,
													conversion: units.conversion,
											  }
											: undefined,
									ocr: {
										name: itemWord.text,
										value: value.word.text,
										units: units?.word.text,
										range: range?.word.text,
										conversion: units?.conversion != 1 ? units?.conversion : undefined,
									},
								},
							};
							results.push(result);

							if (units == null) {
								warnings.push({
									message: `E002: Can't find units for biomarker: ${item.id}, text: ${itemWord.text}`,
									pageNumber: page.pageNumber,
									bbox,
								});
							}

							// track that this biomarker has been consumed
							const wordIdx: number = biomarkersWords.indexOf(itemWord);
							if (wordIdx != -1) {
								biomarkersWords.splice(wordIdx, 1);
							}
						}
					}
				}
			}
		}

		// create warnings for words that sounded like biomarkers but where not processed
		biomarkersWords.forEach((word) => {
			warnings.push({
				message: `E001: '${word.text}' sounded like a biomarker but could not be processed`,
				pageNumber: page.pageNumber,
				bbox: word.bbox,
			});
		});
	}

	report.results = results;
	if (warnings.length > 0) {
		report.extras = { ...report.extras, warnings };
	}

	console.log(results);
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
		const points = bbox.map((p) => `${(p[0] * w).toFixed(2)},${(p[1] * h).toFixed(2)}`).join(' ');
		return `<polygon points='${points}' class='word'><title>${htmlEntities(tooltip)}</title></polygon>\n`;
	}
	return '';
}

/**
 * Converts annotations to an html page for debugging and development
 * @param annotations Annotations generated by normalizeGoogleVisionAnnotations
 * @param pageNumber Page number is 1 based
 * @returns A simple html page with an svg image showing words in the document
 */
export function annotationsToHtml(page: Page): string {
	let svg = '';
	for (const word of page.words) {
		svg += bboxToSvg(word.bbox, page.width, page.height, word.text);
	}

	svg = `<html><head><style>.word {fill: red; fill-opacity: .1; stroke: green; stroke-width: 1; stroke-opacity: .5;}</style></head>\
    <body><svg height='${page.height}' width='${page.width}'>${svg}</svg></body></html>`;
	return svg;
}


export function annotationsToHtmlPFF(annotations: any, pageNumber?: number): string {
	const page = annotations.pages[(pageNumber || 1) - 1];

	let svg = '';
	for (const word of page.words) {
		svg += bboxToSvg(word.bbox, page.width, page.height, word.text);
	}

	svg = `<html><head><style>.word {fill: red; fill-opacity: .1; stroke: green; stroke-width: 1; stroke-opacity: .5;}</style></head>\
    <body><svg height='${page.height}' width='${page.width}'>${svg}</svg></body></html>`;
	return svg;
}
