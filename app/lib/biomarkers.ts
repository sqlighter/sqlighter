//
// biomarkers.ts
//

import Fuse from "fuse.js"
import Tokenizr from "tokenizr"
import assert from "assert"
import path from "path"

import { round } from "./utilities"
import { Unit } from "./units"
import { Content, loadContents, DEFAULT_LOCALE } from "./contents"
import { Metadata } from "./metadata"
import { Organization } from "./organizations"

export const BIOMARKERS_SEARCH_CONFIDENCE = 0.7
export const UNITS_SEARCH_CONFIDENCE = 0.7

/** A biomarker, eg. glucose, hdl, ldl, weight, etc */
export class Biomarker extends Content {
  /** Define content type  */
  public static get contentType(): string {
    return "biomarker"
  }

  /** Measurement unit for this biomarker */
  unit?: Unit

  /** Range for this biomarker, eg. 120-150 */
  range?: string

  /**
   * Custom conversions when required for example to go
   * from mg/dL to mmol/L which is specific to this biomarker
   */
  conversions?: { [unit: string]: number }

  /** Localized biomarkers search indexes are lazy loaded synchronously once */
  private static readonly _biomarkersFuse: { [locale: string]: Fuse<Biomarker> } = {}

  //
  // static methods
  //

  /** Lazy load dictionary of available biomarkers */
  public static async getContents(locale: string = DEFAULT_LOCALE): Promise<{ [contentId: string]: Content }> {
    return await loadContents<Biomarker>(this.contentType, locale, Biomarker)
  }

  /** Returns available localized biomarkers */
  public static async getBiomarkers(locale: string = DEFAULT_LOCALE): Promise<{ [biomarkerId: string]: Biomarker }> {
    return (await this.getContents(locale)) as { [biomarkerId: string]: Biomarker }
  }

  /** Returns biomarker by id (or undefined), localized if requested */
  public static async getBiomarker(
    biomarkerId: string,
    locale: string = DEFAULT_LOCALE
  ): Promise<Biomarker | undefined> {
    const biomarkers = await Biomarker.getBiomarkers(locale)
    return biomarkers[biomarkerId]
  }

  /**
   * Will fuzzy search a biomarker by id, name or words in its description
   * and return a ranked list of possible biomarkers hits including a score
   * where zero is a perfect match.
   * @see https://fusejs.io/examples.html#extended-search
   * @param query A name to search (may contain wildcards for extended search)
   * @param confidence Will return only results exceeding this confidence level (0 to 1)
   * @returns A ranked list of possible matches
   */
  public static async searchBiomarkers(
    query: string,
    locale?: string
  ): Promise<{ item: Biomarker; confidence: number }[]> {
    const biomarkers = await Biomarker.getBiomarkers(locale)
    let biomarkersFuse = Biomarker._biomarkersFuse[locale]

    if (!biomarkersFuse) {
      // fuse index used for searches
      biomarkersFuse = new Fuse<Biomarker>(Object.values(biomarkers), {
        minMatchCharLength: 4,
        includeScore: true,
        keys: [
          { name: "id", weight: 1.0 },
          { name: "title", weight: 1.0 },
          { name: "aliases", weight: 0.9 },
          { name: "description", weight: 0.5 },
          { name: "content", weight: 0.25 },
        ],
      })

      Biomarker._biomarkersFuse[locale] = biomarkersFuse
    }

    assert(biomarkersFuse)
    const matches = biomarkersFuse.search(query)
    if (matches) {
      let filtered = matches.map((m) => {
        return { item: biomarkers[m.item.id] as Biomarker, confidence: 1 - (m.score as number) }
      })
      filtered = filtered.filter((m) => m.confidence >= BIOMARKERS_SEARCH_CONFIDENCE)
      return filtered
    }

    return []
  }

  /**
   * Parse a biomarker value like 10.40 or 234,34 or positive or negative or assente
   * @param text A value string
   * @returns Parsed value or null
   */
  public static parseValue(text: string): { value: number; text?: string } | null {
    const { sequence, tokens } = parseTokens(text.toLowerCase())
    if (sequence && tokens) {
      switch (sequence) {
        case "number-eof":
        case "positive-eof":
        case "negative-eof":
        case "missing-eof":
          return tokens[0]?.value
      }
    }
    return null
  }

  /**
   * Will parse a piece of text looking for a measurement unit that is compatible with the given biomarker
   * @param text The text that could contain the biomarker's units
   * @param biomarker A biomarker as returned by searchBiomarkers
   * @returns A unit and its optional conversion ratio to the biomarker's base unit
   */
  public static parseUnits(
    text: string,
    biomarker: Biomarker
  ): { id: string; conversion: number; confidence: number } | null {
    if (!biomarker.unit) {
      console.warn(`parseUnits - biomarker: ${biomarker.id} does not have a measurement unit`)
      return null
    }

    // each biomarker has a main unit of measurement which is preferred (normally the SI unit)
    // and a number of available conversions that can also be read. normally the conversion
    // factors are stored in unit.metadata.conversion. however, some conversions like mmol/L
    // (a quantity of molecules) to mg/L (a weight) require a conversion ratio that is specific
    // to the biomarker and is therefore stored in biomarker.metadata.conversions.
    const unitsCandidates = [biomarker.unit.id]
    const unitsConversions = [1]

    if (biomarker.conversions) {
      unitsCandidates.push(...Object.keys(biomarker.conversions))
      unitsConversions.push(...Object.values(biomarker.conversions))
    }
    if (biomarker.unit?.conversions) {
      unitsCandidates.push(...Object.keys(biomarker.unit.conversions))
      unitsConversions.push(...Object.values(biomarker.unit.conversions))
    }

    const unitsFuse = new Fuse(unitsCandidates, { minMatchCharLength: 1, includeScore: true })
    const unitsMatches = unitsFuse.search(text)

    if (unitsMatches.length > 0 && unitsMatches[0]) {
      const confidence = 1 - (unitsMatches[0].score as number)
      if (confidence > UNITS_SEARCH_CONFIDENCE) {
        return {
          id: unitsMatches[0].item,
          conversion: unitsConversions[unitsMatches[0].refIndex] as number,
          confidence,
        }
      }
    }

    return null
  }
}

/** A suggested range for a biomarker */
export class Range {
  constructor(
    min?: number,
    max?: number,
    text?: string,
    custom?: { tags: string[]; min?: number; max?: number; text?: string }[]
  ) {
    this.min = min
    this.max = max
    this.text = text
  }

  /** Minimum value for range */
  min?: number

  /** Maximum value for range */
  max?: number

  /** Textual value, eg. 'positive' */
  text?: string

  /** TODO Custom ranges for custom tags, eg. "men", "women", "kids", "30-40", etc */
  custom?: { tags: string[]; min?: number; max?: number; text?: string }[]

  //
  // methods
  //

  /** Apply conversion factor to this range */
  public convert(conversion: number) {
    if (conversion != 1) {
      this.min = this.min !== undefined ? round(this.min / conversion) : undefined
      this.max = this.max !== undefined ? round(this.max / conversion) : undefined
      this.text = undefined
      if (this.custom) {
        this.custom.forEach((r) => {
          r.min = r.min !== undefined ? round(r.min / conversion) : undefined
          r.max = r.max !== undefined ? round(r.max / conversion) : undefined
          r.text = undefined
        })
      }
    }
  }

  public toString() {
    if (this.text) {
      return this.text
    }

    if (this.min != undefined) {
      if (this.max != undefined) {
        return `[${this.min} - ${this.max}]`
      }
      return `[> ${this.min}]`
    }

    assert(this.max != undefined)
    return `[< ${this.max}]`
  }

  /** Will render to string if nested in a json */
  public toJSON(key: any) {
    return key != undefined ? this.toString() : this
  }

  //
  // static methods
  //

  /**
   * Parse a biomarkers range string like 10-20 into its components
   * @param text A range string like [10,20-20,80] or 345-500 etc
   * @returns Structured range or null
   */
  public static parseRange(text: string): Range | null {
    const { sequence, tokens } = parseTokens(text.toLowerCase())
    if (sequence && tokens) {
      tokens.forEach((t) => {
        if (t.type == "number" && t.value.text == undefined) {
          t.value.text = t.value.value
        }
      })

      // eg. [10-20]
      if (sequence == "startrange-number-dash-number-endrange-eof") {
        return new Range(
          tokens[1]?.value.value,
          tokens[3]?.value.value,
          `[${tokens[1]?.value.text} - ${tokens[3]?.value.text}]`
        )
      }
      // eg. 10-20
      if (sequence == "number-dash-number-eof") {
        return new Range(
          tokens[0]?.value.value,
          tokens[2]?.value.value,
          `[${tokens[0]?.value.text} - ${tokens[2]?.value.text}]`
        )
      }
      // eg. [assenti]
      if (sequence == "startrange-number-endrange-eof") {
        return new Range(tokens[1]?.value.value, tokens[1]?.value.value, `[${tokens[1]?.value.text}]`)
      }
      // eg. <20 or <=20
      if (sequence == "lessthan-number-eof") {
        return new Range(undefined, tokens[1]?.value.value, `[< ${tokens[1]?.value.text}]`)
      }
      // eg. [<20]
      if (sequence == "startrange-lessthan-number-endrange-eof") {
        return new Range(undefined, tokens[2]?.value.value, `[< ${tokens[2]?.value.text}]`)
      }
      // eg. >20 or ≥20
      if (sequence == "morethan-number-eof") {
        return new Range(tokens[1]?.value.value, undefined, `[> ${tokens[1]?.value.text}]`)
      }
      // eg. [>50]
      if (sequence == "startrange-morethan-number-endrange-eof") {
        return new Range(tokens[2]?.value.value, undefined, `[> ${tokens[2]?.value.text}]`)
      }
    }
    return null
  }
}

/** A biomarker measurement, eg. current glucose level */
export class Measurement {
  constructor(biomarker: Biomarker, value?: number, text?: string, unit?: Unit, range?: Range, metadata?: any) {
    this.biomarker = biomarker
    this.value = value
    this.text = text
    this.unit = unit
    this.range = range
    this.metadata = new Metadata(metadata)
  }

  /** The biomarker that was measured */
  biomarker: Biomarker

  /** Numeric value of the measurement expressed in units */
  value?: number

  /** Textual value of the measurement, if applicable. Eg. 'negative' */
  text?: string

  /** The measurement unit (normally matches biomarker.unit) */
  unit?: Unit

  /** Optional range suggested by the lab. May differ from range in biomarker card itself. */
  range?: Range

  /** Additional metadata, for example the OCR information that this measure derives from */
  metadata: Metadata
}

//
// Utilities
//

// Parsing of biomarker values and ranges
// https://www.npmjs.com/package/tokenizr
const lexer = new Tokenizr()
lexer.rule(/(\d+([\.,]\d+)?)/, (ctx, match) => {
  // accept floating point with both . and , decimals
  ctx.accept("number", { value: match[0] && parseFloat(match[0].replace(",", ".")) })
})
lexer.rule(/assente|assenti/, (ctx, match) => {
  ctx.accept("number", { value: 0, text: "missing" })
})
lexer.rule(/negative|negativo/, (ctx, match) => {
  ctx.accept("number", { value: 0, text: "negative" })
})
lexer.rule(/positive|positivo/, (ctx, match) => {
  ctx.accept("number", { value: 1, text: "positive" })
})
lexer.rule(/<=|≤|</, (ctx, match) => {
  ctx.accept("lessthan")
})
lexer.rule(/>=|≥|>|sup\. a/, (ctx, match) => {
  ctx.accept("morethan")
})
lexer.rule(/\[/, (ctx, match) => {
  ctx.accept("startrange")
})
lexer.rule(/\]/, (ctx, match) => {
  ctx.accept("endrange")
})
lexer.rule(/-/, (ctx, match) => {
  ctx.accept("dash")
})
lexer.rule(/\s+/, (ctx, match) => {
  ctx.ignore()
})

function parseTokens(text: string) {
  try {
    lexer.reset()
    lexer.input(text)
    let tokens = lexer.tokens()
    const sequence = tokens.reduce((a, b) => (b.type != "EOF" ? a + b.type + "-" : a + "eof"), "")
    return { sequence, tokens }
  } catch (exception) {
    // console.debug(`parseTokens - text: ${text}, exception: ${exception}`);
  }
  return { sequence: null, tokens: null }
}

// class also acts as default export for module
export default Unit
