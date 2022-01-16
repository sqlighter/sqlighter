//
// reports.ts
//

import assert from 'assert/strict';

import { BoundingBox, getBoundingBoxAlignments, mergeBoundingBoxes } from './geometry';
import { Unit } from './units';
import { Page, getOcrAnnotations } from './ocr';
import { Biomarker, parseRange, parseValue, parseUnits } from './biomarkers';

//
// Types
//

/** A report inclusive of a number of pages, OCR information, metadata, etc */
export class Report {
	constructor(pages: Page[], extras?: any) {
    assert(pages && pages.length > 0, "Report - pages is empty")
		this.pages = pages;
		this.extras = extras;
	}

	/** Pages in this report with fulltext, OCR words, etc */
	pages: Page[];

	/** Biomarker results detected in this report */
	results?: any[];

	extras?: any;

	//
	// methods
	//

	/** Detect biomarker readings in OCR words */
	private async detectBiomarkers() {
		const results = [];
		const warnings: { message: string; pageNumber?: number; bbox?: BoundingBox }[] = [];

		for (const page of this.pages) {
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
				const biomarkersMatches = await Biomarker.searchBiomarkers(word.text);
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
						const biomarkersMatches = await Biomarker.searchBiomarkers(line[0].text);
						if (biomarkersMatches.length > 0 && biomarkersMatches[0]) {
							const item = biomarkersMatches[0].item;
							const itemConfidence = biomarkersMatches[0].confidence;
							const itemWord = line[0];

							console.debug(
								`biomarkers_detect - text: ${line[0].text}, id: ${item.id}/${item.translations?.[0]?.name}, confidence: ${itemConfidence}`
							);

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
									name: item.translations?.[0]?.name,
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

		this.results = results;
		if (warnings.length > 0) {
			this.extras = { ...this.extras, warnings };
		}

		console.log(results);
	}

	/** Analyze an OCR generated report and extract metadata and biomarkers reading */
	public async analyzeOcr() {
		for (const page of this.pages) {
			// remove words which aren't horizontal or are too small, etc
			page.cleanupWords();
			// merge words into short sentences or little chunks of text
			page.mergeWords();
			// sort top to bottom, left to right
			page.sortWords();
			// group words into lines
			page.groupWordsIntoLines();
		}

		// detect all biomarkers on all pages
		await this.detectBiomarkers();
	}

	/**
	 * Converts a report page into html that can be used to debug OCR and metadata
	 * @param pageNumber Page number is 1 based
	 * @returns A simple html page with an svg image showing words in the document
	 */
	public toHtml(pageNumber: number): string {
		if (this.pages.length < pageNumber) {
			throw new Error(`Report.toHtml(${pageNumber}) - report has ${this.pages.length} pages`);
		}

		let svg = '';
		const page: Page = this.pages[pageNumber - 1] as Page;
		for (const word of page.words) {
			svg += bboxToSvg(word.bbox, page.width, page.height, word.text);
		}

		svg = `<html><head><style>.word {fill: red; fill-opacity: .1; stroke: green; stroke-width: 1; stroke-opacity: .5;}</style></head>\
      <body><svg height='${page.height}' width='${page.width}'>${svg}</svg></body></html>`;
		return svg;
	}

	//
	// static methods
	//

  /**
   * Will run optical character recognition on the given pdf or tiff document located
   * on the local disk or in Google Storage. Will then process ocr annotations and, 
   * if requested, analyze the document looking for biomarker reading results.
   * @returns A report with OCR annotations and possibly biomarker results and more metadata
   */
	public static async fromOcr(sourceUri: string, analyze: boolean = true): Promise<Report> {
		const { pages, extras } = await getOcrAnnotations(sourceUri);
		const report = new Report(pages, extras);
		if (analyze) {
			await report.analyzeOcr();
		}
		return report;
	}
}

//
// Utilities
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
