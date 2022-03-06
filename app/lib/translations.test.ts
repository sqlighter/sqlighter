/**
 * @jest-environment jsdom
 */

import path from "path"
import fs from "fs/promises"
import matter from "gray-matter"
import { fsExists } from "./utilities"
import { translateAll, translateContent } from "./translations"

describe("localizations.ts", () => {
  // The test below is used to run a complete machine translation
  // of all contents which are then checked in to the source depot.
  // The code will skip all those contents that have been manually
  // translated. Since this can take a while, if you run into a timeout
  // it means that you need to increase package.json > jest > testTimeout
  /*
  test("localizeAll", async () => {
    await translateAll()
  })
*/

  //
  // integration tests that translate a single file
  //

  test("translateContent (it-IT)", async () => {
    const srcFilename = path.resolve("./lib/test/cholesterol.md")
    const dstMatter = await testTranslateContent(srcFilename, "it-IT")

    // some keys are translated
    expect(dstMatter.data.translation).toBe("automatic")
    expect(dstMatter.data.title).toBe("Colesterolo")
    expect(dstMatter.data.description).toBe("Una sostanza cerosa, simile al grasso")
    expect(dstMatter.content.startsWith("\nIl colesterolo è una sostanza cerosa simile al grasso")).toBeTruthy()
    expect(dstMatter.content.indexOf("![Famiglia che mangia a casa](<images/") != -1).toBeTruthy()

    // some keys are NOT translated
    expect(dstMatter.data.unit).toBeFalsy()
    expect(dstMatter.data.conversions).toBeFalsy()
  })

  test("translateContent (fr-FR)", async () => {
    const srcFilename = path.resolve("./lib/test/cholesterol.md")
    const dstMatter = await testTranslateContent(srcFilename, "fr-FR")

    // some keys are translated
    expect(dstMatter.data.translation).toBe("automatic")
    expect(dstMatter.data.title).toBe("Cholestérol")
    expect(dstMatter.data.description).toBe("Une substance cireuse ressemblant à de la graisse")
    expect(dstMatter.content.startsWith("\nLe cholestérol est une substance cireuse ressemblant")).toBeTruthy()
    expect(dstMatter.content.indexOf("![Famille mangeant à la maison](<images/") != -1).toBeTruthy()

    // some keys are NOT translated
    expect(dstMatter.data.unit).toBeFalsy()
    expect(dstMatter.data.conversions).toBeFalsy()
  })

  test("translateContent (zh-CN)", async () => {
    const srcFilename = path.resolve("./lib/test/cholesterol.md")
    const dstMatter = await testTranslateContent(srcFilename, "zh-CN")

    // some keys are translated
    expect(dstMatter.data.translation).toBe("automatic")
    expect(dstMatter.data.title).toBe("胆固醇")
    expect(dstMatter.data.description).toBe("一种蜡状的脂肪状物质")
    expect(dstMatter.content.startsWith("\n胆固醇是一种蜡状脂肪状物质")).toBeTruthy()
    expect(dstMatter.content.indexOf("![一家人在家吃饭](<images") != -1).toBeTruthy()

    // some keys are NOT translated
    expect(dstMatter.data.unit).toBeFalsy()
    expect(dstMatter.data.conversions).toBeFalsy()
  })

  test("translateContent (ja-JP)", async () => {
    const srcFilename = path.resolve("./lib/test/cholesterol.md")
    const dstMatter = await testTranslateContent(srcFilename, "ja-JP")

    // some keys are translated
    expect(dstMatter.data.translation).toBe("automatic")
    expect(dstMatter.data.title).toBe("コレステロール")
    expect(dstMatter.data.description).toBe("ワックス状の脂肪のような物質")

    expect(dstMatter.content.startsWith("\nコレステロールは、体のすべての細胞")).toBeTruthy()
    expect(dstMatter.content.indexOf("![家で食べる家族](<images/") != -1).toBeTruthy()
  })

  test("showdown.makeMarkdown", async () => {
    let showdown = require("showdown")
    let converter = new showdown.Converter()
    let html = '<a href="https://biomarkers.app">Biomarkers.app</a>'
    let md = converter.makeMarkdown(html)
    expect(md).toBe("[Biomarkers.app](<https://biomarkers.app>)")
  })
})

async function testTranslateContent(filePath, locale) {
  const srcFilename = path.resolve(filePath)
  const srcDirectory = path.dirname(srcFilename)

  const dstDirectory = path.join(srcDirectory, locale)
  const dstFilename = path.join(dstDirectory, path.basename(srcFilename))
  if (await fsExists(dstFilename)) {
    await fs.unlink(dstFilename)
  }

  await translateContent(srcFilename, locale)
  const dstContents = await fs.readFile(dstFilename, "utf8")
  const dstMatter = matter(dstContents)

  // no lines starting with a comma which seems to be an artifact
  // of translating with html that has </p>\n<p>...
  const startOfLineCommas = dstMatter.content.indexOf("\n,")
  expect(startOfLineCommas).toBe(-1)
  return dstMatter
}
