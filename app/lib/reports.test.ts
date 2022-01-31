// scan.ts testsn

import { resolve } from "path"
import fs from "fs/promises"
import path from "path"

import { Ocr } from "./ocr"
import { Report } from "./reports"
import { writeJson, readJson } from "./utilities"
import { Biomarker } from "./biomarkers"
import { Unit } from "./units"

describe("reports.ts", () => {
  beforeAll(async () => {
    await Unit.updateUnits()
    await Biomarker.updateBiomarkers()
  })

  // the test directory contains a number of xxx.pdf and xxx.pdf.report.json
  // files where the second file contains a completed report containing the
  // biomarkers that are expected to be found in the report. we can analyze
  // the pdf and then match against the expected results to see if anything
  // has gone missing

  test("Report.analyzeOcr (report01.pdf)", async () => {
    await analyzePdf("report01.pdf")
  })

  /** 1 failing
  test("Report.analyzeOcr (report02.pdf)", async () => {
    await analyzePdf("report02.pdf")
  })
*/

  test("Report.analyzeOcr (report03.pdf)", async () => {
    await analyzePdf("report03.pdf")
  })

  test("Report.analyzeOcr (report04.pdf)", async () => {
    await analyzePdf("report04.pdf")
  })

  test("Report.analyzeOcr (report05.pdf)", async () => {
    await analyzePdf("report05.pdf")
  })

  /* more failing
  test("Report.analyzeOcr (report06.pdf)", async () => {
    await analyzePdf("report06.pdf")
  })
  */
})

async function analyzePdf(file: string) {
  // the test directory contains a number of xxx.pdf and xxx.pdf.report.json
  // files where the second file contains a completed report containing the
  // biomarkers that are expected to be found in the report. we can analyze
  // the pdf and then match against the expected results to see if anything
  // has gone missing
  const pdfFile = path.resolve("./lib/test/" + file)
  const expectedFile = pdfFile + ".expected.json"
  const ocrFile = toArtifacts(pdfFile + ".ocr.json")
  console.log(`checking file ${pdfFile}`)

  // if the ocr file is missing just create it once, we don't need to test ocr over and over
  let rawOcr
  try {
    rawOcr = await readJson(ocrFile)
  } catch {
    let scan = await Ocr.scanPages(pdfFile)
    rawOcr = scan.rawOcr
    expect(rawOcr).toBeTruthy()
    await writeJson(ocrFile, rawOcr)
    console.warn(`${ocrFile} was missing and has been generated`)
  }

  // now analyze the ocr file, produce biomarkers and test expected results
  const pages = Ocr.normalizeAnnotations(rawOcr)
  let report = new Report(pages)
  for (const page of pages) {
    const svg = report.toHtml(page.pageNumber)
    const svgPath = toArtifacts(pdfFile + `.page${page.pageNumber}.before.html`)
    await fs.writeFile(svgPath, svg)
  }

  await report.analyzeOcr()
  for (const page of report.pages) {
    const svg = report.toHtml(page.pageNumber)
    const svgPath = toArtifacts(pdfFile + `.page${page.pageNumber}.after.html`)
    await fs.writeFile(svgPath, svg)
  }

  // write actual report to artifacts, stringify/parse report so it's comparable
  const reportFile = toArtifacts(pdfFile + ".actual.json")
  await writeJson(reportFile, report)
  report = await readJson(reportFile) // parse via json so is comparable to .report.json

  let expectedReport
  try {
    expectedReport = await readJson(expectedFile)
  } catch (error) {
    // to simplify adding new reports we save the current results which can be hand edited, etc
    await writeJson(expectedFile, report)
    console.warn(`${expectedFile} was missing and has been generated`)
    expectedReport = await readJson(expectedFile)
  }

  // check pages
  const expectedPages = expectedReport.pages
  expect(pages).toBeTruthy()
  expect(pages.length).toBe(expectedPages.length)

  for (const i in pages) {
    const p1 = pages[i]
    const p2 = expectedPages[i]
    expect(p1).toBeTruthy()
    expect(p2).toBeTruthy()
    if (p1 != null && p2 != null) {
      expect(p1.width).toBeGreaterThan(1)
      expect(p1.width).toBe(p2.width)
      expect(p1.height).toBeGreaterThan(1)
      expect(p1.height).toBe(p2.height)
      expect(p1.pageNumber).toBe(parseInt(i) + 1)
      expect(p1.locale).toBe(p2.locale)
    }
  }

  // check measurements
  let failed = false
  const numBiomarkers = expectedReport.biomarkers?.length
  expect(numBiomarkers).toBeGreaterThan(0)
  if (numBiomarkers != report.biomarkers?.length) {
    console.error(`Biomarkers, expected: ${numBiomarkers}, actual: ${report.biomarkers?.length}`)
    failed = true
  }

  for (const expected of expectedReport.biomarkers) {
    const actual = report.biomarkers?.find((b) => b.biomarker == expected.biomarker)
    if (actual) {
      if (actual.value != expected.value) {
        console.error(
          `Biomarker: '${expected.biomarker}', value differs, expected: ${expected.value}, actual: ${actual.value}`
        )
        failed = true
      }
      if (actual.range != expected.range) {
        console.error(
          `Biomarker: '${expected.biomarker}', range differs, expected: ${expected.range}, actual: ${actual.range}`
        )
        failed = true
      }
      if (actual.unit != expected.unit) {
        console.error(
          `Biomarker: '${expected.biomarker}', unit differs, expected: ${expected.unit}, actual: ${actual.unit}`
        )
        failed = true
      }
    } else {
      console.error(`Biomarker: '${expected.biomarker}' is missing`)
      failed = true
    }
  }
  if (failed) {
    throw new Error("One or more errors while comparing expected vs actual biomarkers, see log")
  }
}

const TEST_PDF_PATH = "./test/analisi02.pdf"
function toArtifacts(path: string) {
  return resolve(path).replace("/test/", "/test/artifacts/")
}
