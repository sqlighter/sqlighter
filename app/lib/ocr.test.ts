//
// ocr.test.ts
//

import { resolve } from "path"
import fs from "fs/promises"
import { Ocr } from "./ocr"
import { writeJson } from "./utilities"

const TEST_PDF_PATH = "./lib/test/report01.pdf"
function toArtifacts(path: string) {
  return resolve(path).replace("/test/", "/test/artifacts/")
}

describe("ocr.ts", () => {
  test("getOcrAnnotations (pdf from local file)", async () => {
    const sourceUri = resolve(TEST_PDF_PATH)
    const { pages, rawOcr, metadata } = await Ocr.scanPages(sourceUri)

    expect(rawOcr).toBeTruthy()
    expect(rawOcr.length).toBe(2)
    expect(rawOcr[0].fullTextAnnotation).toBeTruthy()
    expect(rawOcr[0].fullTextAnnotation.text).toContain("AZIENDA OSPEDALIERA UNIVERSITARIA INTEGRATA")
    expect(rawOcr[1].fullTextAnnotation).toBeTruthy()

    expect(metadata.ocr?.sourceUri).toBe(sourceUri)
    expect(metadata.ocr?.apiEndpoint).toBe("eu-vision.googleapis.com")

    expect(pages).toBeTruthy()
    expect(pages.length).toBe(2)
    for (const page of pages) {
      expect(page).toBeTruthy()
      expect(page?.width).toBe(594)
      expect(page?.height).toBe(841)
      expect(page.locale).toBe("it")
    }

    const destinationPath = toArtifacts(sourceUri + ".ocr.json")
    await writeJson(destinationPath, rawOcr)
  })

  test("getOcrAnnotations (pdf from google storage)", async () => {
    const sourceUri = "gs://insieme/test/analisi02.pdf"
    const { pages, rawOcr, metadata } = await Ocr.scanPages(sourceUri)

    expect(rawOcr).toBeTruthy()
    expect(rawOcr.length).toBe(2)
    expect(rawOcr[0].fullTextAnnotation).toBeTruthy()
    expect(rawOcr[0].fullTextAnnotation.text).toContain("AZIENDA OSPEDALIERA UNIVERSITARIA INTEGRATA")
    expect(rawOcr[1].fullTextAnnotation).toBeTruthy()

    expect(metadata.ocr?.sourceUri).toBe(sourceUri)
    expect(metadata.ocr?.apiEndpoint).toBe("eu-vision.googleapis.com")

    expect(pages).toBeTruthy()
    expect(pages.length).toBe(2)
    for (const page of pages) {
      expect(page).toBeTruthy()
      expect(page?.width).toBe(594)
      expect(page?.height).toBe(841)
      expect(page.locale).toBe("it")
    }
  })
})
