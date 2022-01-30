// units.ts tests
import { Unit, UNITS_SEARCH_CONFIDENCE } from "./units"
import { Biomarker } from "./biomarkers"
import { assert } from "console"

describe("units.ts", () => {
  test("getUnits", () => {
    const units = Unit.getUnits()
    expect(units).toBeTruthy()
    expect(units.length).toBeGreaterThan(10)
    expect(units[0]?.toString()).toContain(":")
  })

  test("getUnit", () => {
    const u1 = Unit.getUnit("μg/L")
    expect(u1).toBeTruthy()
    if (u1) {
      expect(u1 instanceof Unit).toBeTruthy()
      expect(u1.description).toBe("micrograms per liter")
      expect(u1.aliases).toContain("ug/L")
      expect(u1.aliases).toContain("mcg/L")
      expect(u1.conversions["mg/L"]).toBe(0.001)
      expect(u1.toString()).toBe("μg/L: micrograms per liter")
    }
  })

  test("searchUnit", () => {
    const matches = Unit.searchUnits("μg/L")
    expect(matches).toBeTruthy()
    expect(matches.length).toBeGreaterThanOrEqual(1)
    expect(matches[0]?.confidence).toBeGreaterThanOrEqual(UNITS_SEARCH_CONFIDENCE)

    const u1 = matches[0]?.item
    expect(u1).toBeTruthy()
    if (u1) {
      expect(u1 instanceof Unit).toBeTruthy()
      expect(u1.description).toBe("micrograms per liter")
      expect(u1.aliases).toContain("ug/L")
      expect(u1.aliases).toContain("mcg/L")
      expect(u1.conversions["mg/L"]).toBe(0.001)
      expect(u1.toString()).toBe("μg/L: micrograms per liter")
    }
  })

  test("checkBiomarkerConversions", async () => {
    // each biomarker has a main unit of measurement which is preferred (normally the SI unit)
    // and a number of available conversions that can also be read. normally the conversion
    // factors are stored in unit.metadata.conversion. however, some conversions like mmol/L
    // (a quantity of molecules) to mg/L (a weight) require a conversion ratio that is specific
    // to the biomarker and is therefore store in biomarker.metadata.conversions.
    const biomarkers = Biomarker.getBiomarkers()
    for (const biomarker of biomarkers) {
      if (biomarker.unit?.conversions) {
        Object.keys(biomarker.unit.conversions).forEach((unit) => {
          if (biomarker.metadata.conversions?.[unit]) {
            throw new Error(
              `Biomarker ${biomarker.id} - Unit ${biomarker.unit?.id} should not contain a conversion to ${unit}`
            )
          }
        })
      }
    }
  })

  test("checkIncompatibleConversions", () => {
    // TODO we could also introduce unit types and assert conversions between different types
    const from = ["mmol/L", "µmol/L", "umol/L"]
    const to = ["mg/dL", "mg/100mL", "mg%", "mg/L", "µg/mL", "μg/dL", "ug/dL"]

    for (const unit of Unit.getUnits()) {
      if (unit.conversions) {
        for (const conversion of Object.keys(unit.conversions)) {
          if (
            (from.indexOf(unit.id) != -1 && to.indexOf(conversion) != -1) ||
            (from.indexOf(conversion) != -1 && to.indexOf(unit.id) != -1)
          ) {
            throw new Error(`Unit ${unit.id} should not contain a conversion to ${conversion}`)
          }
        }
      }
    }
  })

  test("updateUnits", async () => {
    await Unit.updateUnits()
  })

  // TODO test conversions, add cross pairs, find missing conversions
})
