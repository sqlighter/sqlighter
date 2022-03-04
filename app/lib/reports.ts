//
// reports.ts
//

import assert from "assert/strict"

import { BoundingBox, getBoundingBoxAlignments, mergeBoundingBoxes } from "./geometry"
import { Unit } from "./units"
import { Page, Ocr, Word } from "./ocr"
import { Biomarker, Measurement, Range } from "./items/biomarkers"
import { Metadata } from "./metadata"
import { round, HIGH_CONFIDENCE, MEDIUM_CONFIDENCE, LOW_CONFIDENCE } from "./utilities"

/** A report inclusive of a number of pages, OCR information, metadata, etc */
export class Report {
  constructor(pages: Page[], metadata?: any) {
    assert(pages && pages.length > 0, "Report - pages is empty")
    this.pages = pages
    this.metadata = new Metadata(metadata)
  }

  /** Pages in this report with fulltext, OCR words, etc */
  pages: Page[]

  /** Biomarker measurements detected in this report */
  biomarkers?: Measurement[]

  /** Additional metadata on this report */
  metadata: Metadata

  //
  // methods
  //

  private async _detectBiomarker(line: Word[], locale: string) {
    // for now we assume that the leftmost word on the line is the one containing
    // the biomarkers' name. so we only check the first word on the line since
    // lines are sorted. in the future we may want to scan other words too.
    if (line.length > 0 && line[0]?.text) {
      let text = line[0].text

      // remove unwanted prefixes, eg. Sg-ERITROCITI, P-CREATININA, S-Tirotropina
      for (const prefix of ["Sg-", "P-", "S-"]) {
        if (text.startsWith(prefix)) {
          text = text.substring(prefix.length)
        }
      }

      // TODO could check if text is in list of common words or blocked words for language or template

      const biomarkersMatches = await Biomarker.searchBiomarkers(text, locale)
      if (biomarkersMatches.length > 0 && biomarkersMatches[0]) {
        return {
          item: biomarkersMatches[0].item,
          confidence: biomarkersMatches[0].confidence,
          word: line[0],
        }
      }
    }

    return null
  }

  private _detectUnit(line: Word[], biomarkerMatch: any) {
    let bestMatch = null
    for (const word of line) {
      const u = Biomarker.parseUnits(word.text, biomarkerMatch.item)
      if (u && (bestMatch == null || bestMatch.confidence < u.confidence)) {
        bestMatch = { ...u, word }

        // lower confidence in the unit match if it occours in the same word as the biomarker's name
        // TODO check if close to units column or has same alignment
        if (word == biomarkerMatch.word) {
          bestMatch.confidence = Math.min(bestMatch.confidence, MEDIUM_CONFIDENCE)
        }
      }
      // TODO find units for which there isn't a direct conversion BUT add low confidence
    }
    return bestMatch
  }

  private _detectRange(line: Word[], biomarkerMatch: any, unitMatch: any) {
    // overall confidence in this match is average of different factors
    let bestMatch = null
    for (const word of line) {
      const r = Range.parseRange(word.text)
      if (r) {
        const confidence = word != biomarkerMatch.word && word != unitMatch?.word ? HIGH_CONFIDENCE : MEDIUM_CONFIDENCE
        if (bestMatch == null || confidence > bestMatch?.confidence) {
          if (unitMatch?.conversion) {
            r.convert(unitMatch.conversion)
          }
          // TODO or this range is closer to range's column than previous match
          bestMatch = { range: r, word, confidence }
        }
      }
    }
    return bestMatch
  }

  private _detectValue(line: Word[], biomarkerMatch: any, unitMatch: any, rangeMatch: any) {
    let bestMatch = null
    for (const word of line) {
      if (word != rangeMatch?.word) {
        const v = Biomarker.parseValue(word.text)
        if (v) {
          // TODO this value is closer to value's column than previous value
          const confidence = word != biomarkerMatch.word && word && unitMatch?.word ? HIGH_CONFIDENCE : LOW_CONFIDENCE
          if (bestMatch == null || confidence > bestMatch.confidence) {
            bestMatch = { ...v, word, confidence }
          }
        }
      }
    }
    return bestMatch
  }

  /** Detect biomarker readings in OCR words */
  private async detectBiomarkers() {
    console.time("detectBiomarkers")
    const measurements = []
    const warnings = []

    for (const page of this.pages) {
      assert(page.locale, `Page.locale is missing`)
      if (!page.lines) {
        break
      }

      // determine which words on the page could be possible biomarker labels,
      // measurement units, values and ranges of values. then see if these words
      // are aligned. since biomarkers are often in table format, we should find
      // that some of these are aligned for example on the left (for names) or
      // on the right (for values) or center (ranges), etc.
      const biomarkersWords = []
      const unitsWords = []
      const rangesWords = []
      const valuesWords = []

      for (const word of page.words) {
        const biomarkersMatches = await Biomarker.searchBiomarkers(word.text, page.locale)
        if (biomarkersMatches.length > 0) {
          biomarkersWords.push(word)
        }
        const unitsMatches = Unit.searchUnits(word.text)
        if (unitsMatches.length > 0) {
          unitsWords.push(word)
        }
        if (Biomarker.parseValue(word.text)) {
          valuesWords.push(word)
        }
        if (Range.parseRange(word.text)) {
          rangesWords.push(word)
        }
      }
      /*
			// determine if each category of words has a main alignment (column)
			// console.debug('unitsBoxes', unitsWords.map((w) => bboxToString(w.bbox)).join(', '));
			// console.debug('rangesBoxes', rangesWords.map((w) => bboxToString(w.bbox)).join(', '));
			const biomarkersAlign = getBoundingBoxAlignments(biomarkersWords.map((w) => w.bbox));
			const unitsAlign = getBoundingBoxAlignments(unitsWords.map((w) => w.bbox));
			const rangesAlign = getBoundingBoxAlignments(rangesWords.map((w) => w.bbox));
			const valueAlign = getBoundingBoxAlignments(valuesWords.map((w) => w.bbox));
*/
      for (const line of page.lines) {
        let biomarkerMatch = await this._detectBiomarker(line, page.locale)
        if (biomarkerMatch) {
          let biomarker = biomarkerMatch.item
          let biomarkerTitle = biomarker.title
          const biomarkerWord = biomarkerMatch.word

          // track that this biomarker word has been consumed
          const wordIdx: number = biomarkersWords.indexOf(biomarkerWord)
          if (wordIdx != -1) {
            biomarkersWords.splice(wordIdx, 1)
          }

          // find compatible measurement unit, range and value on the same line
          let unitMatch = this._detectUnit(line, biomarkerMatch)
          if (!unitMatch) {
            // if a biomarker's measurement unit was not found but we have the same biomarker
            // in percentage and absolute form, like for example ba-abs and ba-perc then let's try
            // the other biomarker and see if that works.
            const isAbs = biomarker.id.endsWith("-abs"),
              isPerc = biomarker.id.endsWith("-perc")
            if (isAbs || isPerc) {
              const altId = biomarker.id.substring(0, biomarker.id.indexOf("-")) + (isPerc ? "-abs" : "-perc")
              const alt = await Biomarker.getBiomarker(altId, page.locale)
              if (alt) {
                const altMatch = { item: alt, confidence: biomarkerMatch.confidence, word: biomarkerMatch.word }
                let altUnitMatch = this._detectUnit(line, altMatch)
                /*
                if (!altUnitMatch && isPerc) {
                  // if target unit is % we can assume it was missed by OCR although with lower confidence
                  altUnitMatch = {id: "%", word: biomarkerMatch.word, confidence: LOW_CONFIDENCE, conversion: 1}
                }
*/
                if (altUnitMatch) {
                  biomarker = alt
                  biomarkerMatch = altMatch
                  biomarkerTitle = biomarker.title
                  unitMatch = altUnitMatch
                  unitMatch.confidence = Math.min(unitMatch.confidence, MEDIUM_CONFIDENCE)
                }
              }
            }
          }

          const rangeMatch = this._detectRange(line, biomarkerMatch, unitMatch)
          const valueMatch = this._detectValue(line, biomarkerMatch, unitMatch, rangeMatch)

          const confidence =
            biomarkerMatch.confidence * 0.55 +
            (unitMatch?.confidence || 0) * 0.15 +
            (rangeMatch?.confidence || 0) * 0.15 +
            (valueMatch?.confidence || 0) * 0.15

          console.debug(
            `detectBiomarkers - text: ${biomarkerWord.text}, id: ${biomarker.id}/${biomarkerTitle}, unit: ${unitMatch?.id}, range: ${rangeMatch?.range}, value: ${valueMatch?.value}, confidence: ${confidence}, locale: ${page.locale}`
          )

          // create entry for measurements or warnings
          const bbox = mergeBoundingBoxes(line.map((w) => w.bbox))
          const medatata = new Metadata({
            name: biomarkerTitle,
            confidence: confidence,
            ocr: {
              name: biomarkerWord.text,
              value: valueMatch?.word.text,
              range: rangeMatch?.word.text,
              unit: unitMatch?.word.text,
              conversion: unitMatch?.conversion != 1 ? unitMatch?.conversion : undefined,
            },
          })
          const measurement = new Measurement(
            biomarker,
            valueMatch ? round(valueMatch.value / (unitMatch?.conversion || 1.0)) : undefined,
            valueMatch ? valueMatch.text : undefined,
            unitMatch ? biomarker.unit : undefined,
            rangeMatch?.range,
            medatata
          )

          if (valueMatch && unitMatch) {
            measurements.push(measurement)
          } else {
            warnings.push({
              message: `E001: Biomarker '${biomarker.id}', text: '${biomarkerWord.text}' is missing value or unit`,
              confidence,
              measurement,
              pageNumber: page.pageNumber,
              bbox,
            })
          }
        }
      }
    }

    this.biomarkers = measurements
    if (warnings.length > 0) {
      this.metadata = { ...this.metadata, warnings }
    }

    console.timeEnd("detectBiomarkers")
  }

  /** Analyze an OCR generated report and extract metadata and biomarkers reading */
  public async analyzeOcr() {
    for (const page of this.pages) {
      // remove words which aren't horizontal or are too small, etc
      page.cleanupWords()
      // merge words into short sentences or little chunks of text
      page.mergeWords()
      // sort top to bottom, left to right
      page.sortWords()
      // group words into lines
      page.groupWordsIntoLines()
    }

    // detect all biomarkers on all pages
    await this.detectBiomarkers()
  }

  /**
   * Converts a report page into html that can be used to debug OCR and metadata
   * @param pageNumber Page number is 1 based
   * @returns A simple html page with an svg image showing words in the document
   */
  public toHtml(pageNumber: number): string {
    if (this.pages.length < pageNumber) {
      throw new Error(`Report.toHtml(${pageNumber}) - report has ${this.pages.length} pages`)
    }

    let svg = ""
    const page: Page = this.pages[pageNumber - 1] as Page
    for (const word of page.words) {
      svg += _bboxToSvg(word.bbox, page.width, page.height, word.text)
    }

    svg = `<html><head><style>.word {fill: red; fill-opacity: .1; stroke: green; stroke-width: 1; stroke-opacity: .5;}</style></head>\
      <body><svg height='${page.height}' width='${page.width}'>${svg}</svg></body></html>`
    return svg
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
    const { pages, metadata: extras } = await Ocr.scanPages(sourceUri)
    const report = new Report(pages, extras)
    if (analyze) {
      await report.analyzeOcr()
    }
    return report
  }
}

//
// Utilities
//

function _htmlEntities(str?: string) {
  if (str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  }
  return null
}

function _bboxToSvg(bbox: BoundingBox, w: number, h: number, tooltip?: string) {
  if (bbox) {
    const points = bbox.map((p) => `${(p[0] * w).toFixed(2)},${(p[1] * h).toFixed(2)}`).join(" ")
    return `<polygon points='${points}' class='word'><title>${_htmlEntities(tooltip)}</title></polygon>\n`
  }
  return ""
}
