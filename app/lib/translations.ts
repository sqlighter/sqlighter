//
// translations.ts - machine translation of contents of markdown and other contents
//

import path from "path"
import fs from "fs/promises"
import { assert } from "console"
import { fsExists } from "./utilities"

import matter from "gray-matter" // front matter in yaml
import showdown from "showdown" // markdown to html and viceversa
import yaml from "yaml" // read, write yaml
import { parse } from "node-html-parser" // parse html

// Google Translate API client
const { Translate } = require("@google-cloud/translate").v2
const googleTranslate = new Translate()

// showdown used to convert markdown into html prior to translation
const showdownConverter = new showdown.Converter()

// Keys from markdown front matter that should also be translated
const TRANSLATE_KEYS = ["title", "description"] // + markdown content

/**
 * Translates a .md file containing markdown with prefixed attributes in yaml
 * as front matter. Only the markdown (content) and the keys described in the parameter
 * are translated. The file is saved in the same location + /locale.
 * @param contentFilename The file to be translated, should have .md extension
 * @param locale The target locale, eg. it-IT
 * @param keys The list of keys to be translated
 */
export async function translateContent(contentFilename: string, locale: string, keys = TRANSLATE_KEYS) {
  try {
    const srcFilename = path.normalize(contentFilename)
    const srcDirectory = path.dirname(srcFilename)

    const dstLanguage = locale.substring(0, 2)
    const dstDirectory = path.join(srcDirectory, locale)
    const dstFilename = path.join(dstDirectory, path.basename(srcFilename))
    if (!(await fsExists(dstDirectory))) {
      await fs.mkdir(dstDirectory)
    }

    // source file is in markdown format with frontmatter header in yaml
    const srcContents = await fs.readFile(srcFilename, "utf8")
    const srcMatter = matter(srcContents)
    const srcData: any = srcMatter.data

    // read already localized contents if they exist
    let dstMatter: any = { data: {} }
    if (await fsExists(dstFilename)) {
      const dstContents = await fs.readFile(dstFilename, "utf8")
      dstMatter = matter(dstContents)
    }

    // skip if this item was translated manually
    const translationType = dstMatter.data.translation
    assert(
      !translationType || translationType == "automatic" || translationType == "manual",
      `translateContent - ${dstFilename} - translation: ${translationType} is invalid`
    )
    if (translationType != "manual") {
      // mark file as automatically translated
      dstMatter.data.translation = "automatic"

      // collect all the keys that need translations
      let translatables = ""
      for (const key of keys) {
        const translatable = srcData[key]?.trim()
        if (translatable) {
          translatables += `<section id='${key}'>${translatable}</section>\n`
        }
      }

      // if the .md file has actual markdown content add as html
      // so it can be translated while maintaining the tags.
      // also providing all the fields at once instead of individual
      // strings helps google translate understand the context of the strings
      const srcMarkdown = srcMatter.content?.toString()
      if (srcMarkdown) {
        const srcHtml = showdownConverter.makeHtml(srcMarkdown)
        translatables += `<content>${srcHtml}</content>\n`
      }

      // machine translate
      const [translated] = await googleTranslate.translate(translatables, { source: "en", to: dstLanguage })

      // translation retains the html structure, parse sections and extract strings
      const translatedElements = parse(translated)
      const nodes = translatedElements.childNodes as unknown as HTMLElement[]
      for (const node of nodes) {
        // remove chars encoded as html
        // TODO could provide a JSDOM link to avoid error when environment is not a browser
        let translation = node.childNodes.toString()
        translation = showdownConverter.makeMarkdown(translation)
        translation = translation.replaceAll("\n,", "\n")
        translation = translation.trim()
        if (node.tagName == "CONTENT") {
          dstMatter.content = translation
        } else {
          dstMatter.data[node.id] = translation
        }
      }

      let dstContents = "---\n" + yaml.stringify(dstMatter.data).trim() + "\n---\n\n"
      if (dstMatter.content) {
        dstContents += dstMatter.content.trim() + "\n"
      }

      await fs.writeFile(dstFilename, dstContents)
      console.debug(`translateContent - ${dstFilename} - translated`)
    } else {
      console.debug(`translateContent - ${dstFilename} - skipped`)
    }
  } catch (exception) {
    console.error(`translateContent - srcFilename: ${contentFilename}, locale: ${locale}, exception: ${exception}`)
    throw exception
  }
}

/**
 * Translates an entire directory file by file
 * @param contentsDirectory Directory to be translated (only .md files will be considered)
 * @param locale Locale to be translated to, eg. it-IT
 * @param keys The keys that should be translated in the front matter of each file
 */
export async function translateContents(contentsDirectory: string, locale: string, keys = TRANSLATE_KEYS) {
  try {
    // scan source directory
    let fileNames = await fs.readdir(contentsDirectory)

    for (const fileName of fileNames) {
      const srcFilename = path.join(contentsDirectory, fileName)

      // scan each .md file for translatable contents
      if (!srcFilename.startsWith(".") && srcFilename.endsWith(".md") && (await fs.stat(srcFilename)).isFile()) {
        await translateContent(srcFilename, locale, keys)
      }
    }
  } catch (exception) {
    console.error(`translateContents - ${contentsDirectory}/${locale}, ${exception}`)
    throw exception
  }
}

/** Translate all contents in all languages */
export async function translateAll() {
  // TODO could use next.js list of languages and scan contents directory for content names
  const contents = ["articles", "biomarkers", "topics"]
  const locales = ["it-IT", "fr-FR"]

  for (const content of contents) {
    for (const locale of locales) {
      const biomarkersPath = path.resolve(`./contents/${content}`)
      await translateContents(biomarkersPath, locale)
    }
  }
}
