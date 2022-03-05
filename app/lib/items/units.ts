//
// units.ts - measurement units utilities
//

import Fuse from "fuse.js"
import { Content, loadContents, DEFAULT_LOCALE } from "./contents"
import { Item } from "./items"

// default confidence level used for searchUnits
export const UNITS_SEARCH_CONFIDENCE = 0.7

export const UNIT_TYPE = "unit"

/** A measurement unit */
export class Unit extends Item {
  constructor(id?: string) {
    super()
    this.type = UNIT_TYPE
    this.id = id
  }

  /** Define content type  */
  public static get itemType(): string {
    return UNIT_TYPE
  }

  /** Unit is also know as, eg. ug/L */
  aliases?: string[]

  /** A list of other units and a conversion value, eg. μg/L to mg/L is 0.001 */
  conversions?: { [unit: string]: number }

  //
  // public methods
  //

  public toString(): string {
    return `${this.id}: ${this.description}`
  }

  //
  // static methods
  //

  /** Lazy load dictionary of available topics */
  public static async getContents(locale: string = DEFAULT_LOCALE): Promise<{ [contentId: string]: Content }> {
    return await loadContents<Unit>(UNIT_TYPE, locale, Unit)
  }

  /** Returns list of all available measurement units */
  public static async getUnits(locale: string = DEFAULT_LOCALE): Promise<{ [unitId: string]: Unit }> {
    return (await this.getContents(locale)) as { [unitId: string]: Unit }
  }

  /** Returns measurement unit by id (or undefined) */
  public static async getUnit(unitId: string, locale: string = DEFAULT_LOCALE): Promise<Unit | undefined> {
    const units = await Unit.getUnits(locale)
    return units[unitId]
  }

  // index used for searching
  static readonly _unitsFuse: { [locale: string]: Fuse<any> } = {}

  /** Search given unit by text and returns zero or more matches with given or higher confidence (a 0 to 1 value) */
  public static async searchUnits(
    text: string,
    confidence: number = UNITS_SEARCH_CONFIDENCE,
    locale: string = DEFAULT_LOCALE
  ): Promise<{ item: Unit; confidence: number }[]> {
    const units = await Unit.getUnits(locale)
    let fuse = Unit._unitsFuse[locale]

    if (!fuse) {
      fuse = new Fuse<any>(
        Object.values(units).map((unit) => {
          return {
            id: unit.id,
            aliases: unit.aliases,
            conversions: unit.conversions && Object.keys(unit.conversions),
          }
        }),
        {
          minMatchCharLength: 1,
          includeScore: true,
          keys: [
            { name: "id", weight: 1.0 },
            { name: "aliases", weight: 0.9 },
            { name: "conversions", weight: 0.8 },
          ],
        }
      )

      Unit._unitsFuse[locale] = fuse
    }

    if (confidence < 0 || confidence > 1) {
      throw new Error(`searchUnits('${text}', ${confidence}) - confidence should be between 0 and 1`)
    }

    const matches = fuse.search(text)
    if (matches) {
      let filtered = matches.map((m) => {
        return { item: units[m.item.id] as Unit, confidence: 1 - (m.score as number) }
      })
      filtered = filtered.filter((m) => m.confidence >= confidence)
      return filtered
    }

    return []
  }
}

// class also acts as default export for module
export default Unit
