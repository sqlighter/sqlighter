//
// contents.ts
//

import path from "path"
import matter from "gray-matter"
import fs from "fs/promises"
import assert from "assert"
import sizeOf from "image-size"
import showdown from "showdown"

import Fuse from "fuse.js"
import Tokenizr from "tokenizr"

import { round } from "../utilities"
import { Unit } from "./units"
import { Metadata } from "../metadata"
import { Organization } from "./organizations"
import { Item } from "./items"

export const BIOMARKERS_SEARCH_CONFIDENCE = 0.7
export const UNITS_SEARCH_CONFIDENCE = 0.7

export const DEFAULT_LOCALE = "en-US"

// TODO to merge localized content
// import { deepmerge } from '@mui/utils';
// const theme = createTheme(deepmerge(options1, options2));

export class Translation {
  constructor(args: { locale: string; [key: string]: string }) {
    this.locale = args.locale
    for (const key of Object.keys(args)) {
      if (args[key]) {
        this[key] = args[key] as string
      }
    }
  }

  /** String locale, eg. en-US, it-IT, etc... */
  locale: string;

  /** Actual translated contents */
  [key: string]: string

  //
  // static methods
  //

  public static fromObject(translations: any[]): Translation[] {
    return translations.map((t) => {
      const { languages_code, locale, id, ...keys } = t
      return new Translation({ locale: languages_code || locale, ...keys })
    })
  }
}

//
//
//

/** An image asset */
export interface ContentImage {
  name: string
  type: string
  width: number
  height: number

  /** Path of image in local file system */
  path?: string
  /** Url of image resource */
  url?: string
}

/** A piece of content like an article, topic, a biomarker, unit, etc */
export class Content extends Item {
  /** Content title, eg. Glucose (localized) */
  title?: string

  /** A short description, eg. Blood sugar (localized) */
  description?: string

  /** Content's page content in markdown format (localized) */
  content?: string

  /** Content converted to html code (localized) */
  contentHtml?: string

  /** Main url of this content */
  url?: string

  /** An image representing this content */
  imageUrl?: string

  /** An optional link to YouTube if this is a video content */
  videoUrl?: string

  /** Current publication status */
  status?: "draft" | "published" | "archived"

  /** Links to external contents (either plain urls or other contents) */
  references?: (string | Content)[]

  /** Biomarker ids related to this content */
  biomarkers?: string[]

  /** List of articles ids related to this content */
  articles?: string[]

  /** Foods related to this content */
  foods?: string[]

  /** Miscellaneous tags */
  tags?: string[]

  /** Other names by which this item is also known (localized) */
  aliases?: string[]

  /** Additional images for this content */
  images?: ContentImage[]

  /** Main locale used by this content */
  locale?: string

  /** The organization related to this content, see Organization */
  organization?: string

  /** Concrete class loads contents from local file system or wherever */
  public static async getContents(locale: string = DEFAULT_LOCALE): Promise<{ [contentId: string]: Content }> {
    throw new Error("Content.getContents - must be defined in subclass")
  }

  /**
   * Returns content with given id (if available)
   * @param id Content id
   * @param locale Locale (defaults to DEFAULT_LOCALE)
   * @param fallback Return default locale item if localized content not found?
   * @returns Content or undefined
   */
  public static async getContent(
    id: string,
    locale: string = DEFAULT_LOCALE,
    fallback: boolean = false
  ): Promise<Content | undefined> {
    // this.getContents refers to the class in a static context
    let contents = await this.getContents(locale)
    if (!contents[id] && fallback && locale != DEFAULT_LOCALE) {
      contents = await this.getContents(DEFAULT_LOCALE)
    }
    return contents[id]
  }
}

//
// Utility methods
//

/** Localized contents are lazy loaded synchronously just once from /contents/ */
const _contentsCache: {
  [contentType: string]: {
    [contentLocale: string]: {
      [contentId: string]: Content
    }
  }
} = {}

export function assertLocale(locale: string) {
  assert(/[a-z]{2}-[A-Z]{2}/.test(locale), `'${locale}' is an invalid locale (eg. en-US, it-IT...)`)
}

/** Returns true if file or directory exists and can be accessed */
async function fsExists(filePath): Promise<boolean> {
  return await fs.access(filePath).then(
    () => true,
    () => false
  )
}

// TODO could memoize the function with a library that has a proper cache, etc
export async function loadContents<T extends Content>(
  contentType: string,
  locale: string = DEFAULT_LOCALE,
  TCreator: new () => T
): Promise<{ [contentId: string]: T }> {
  // if contents already loaded, return cached version
  if (_contentsCache[contentType]?.[locale]) {
    return _contentsCache[contentType][locale] as unknown as { [contentId: string]: T }
  }

  assertLocale(locale)
  const contentsDirectory = path.resolve(`./contents/${contentType}s`)
  const contents = {}

  if (locale != DEFAULT_LOCALE) {
    const localizedDir = path.join(contentsDirectory, locale)
    if (!(await fsExists(localizedDir))) {
      throw new Error(`loadContents - localized directory ${localizedDir} does not exist`)
    }
  }

  const fileNames = await fs.readdir(contentsDirectory)
  for (const fileName of fileNames) {
    const filePath = path.join(contentsDirectory, fileName)
    if (!filePath.startsWith(".") && filePath.endsWith(".md") && (await fs.stat(filePath)).isFile()) {
      const content = await loadContent(filePath, locale, TCreator)
      if (content) {
        contents[content.id] = content
      }
    }
  }

  // cache contents in static
  if (!_contentsCache[contentType]) {
    _contentsCache[contentType] = {}
  }
  _contentsCache[contentType][locale] = contents

  return contents
}

/**
 * Load a single content file of .md type into a subclass of Content
 * @param filePath The path of the file on disk
 * @param locale The preferred locale
 * @param TCreator The constructor to be used to create the object
 * @returns An object of type T that contains the content in filePath.md
 */
export async function loadContent<T extends Content>(
  filePath: string,
  locale: string = DEFAULT_LOCALE,
  TCreator: new () => T
): Promise<T | undefined> {
  assertLocale(locale)
  try {
    const fileContents = await fs.readFile(filePath, "utf8")
    assert(fileContents, `loadContentFile - ${filePath} can't be read`)
    if (fileContents) {
      const fileMatter = matter<string, null>(fileContents)
      assert(fileMatter.data, `loadContentFile - ${filePath} is empty`)
      if (fileMatter.data) {
        const obj: T = Object.assign(new TCreator(), { content: fileMatter.content, ...fileMatter.data })

        if (locale != DEFAULT_LOCALE) {
          const basePath = path.parse(filePath)
          const localizedPath = path.join(basePath.dir, locale, basePath.base)
          const localizedDir = path.parse(localizedPath).dir
          assert(await fsExists(localizedDir), `loadContentFile - localized directory ${localizedDir} does not exist`)

          if (await fsExists(localizedPath)) {
            const localizedContents = await fs.readFile(localizedPath, "utf8")
            if (localizedContents) {
              const localizedMatter = matter(localizedContents)
              if (localizedMatter.data) {
                const localizedObj = { content: localizedMatter.content, ...localizedMatter.data }
                Object.assign(obj, localizedObj)
              }
            }
          }
        }

        // load images related to this content
        if (obj.id) {
          const images = await loadContentImages(path.dirname(filePath), obj.id, locale)
          if (images) {
            obj.images = images
          }
        }

        // fix references that we entered as just a url (instead of a dictionary)
        if (Array.isArray(obj.references)) {
          // if references has just a url convert to object with url property, normally references are dictionaries
          obj.references = obj.references.map((r) => (typeof r == "string" ? { id: r, url: r } : r))
        }

        // fix relative paths of assets if needed
        const basePath = path.resolve("./")
        const relativePath = path.dirname(path.relative(basePath, filePath))
        const prefixUrl = `/api/${relativePath}/`
        if (obj.imageUrl && obj.imageUrl.startsWith("images/")) {
          obj.imageUrl = prefixUrl + obj.imageUrl
        }

        // use showdown to convert markdown into HTML string
        // image in markdown content may have relative paths
        // like images/ which will be converted to absolute urls
        if (typeof obj.content === "string") {
          const converter = new showdown.Converter()
          let contentHtml = converter.makeHtml(obj.content)
          if (contentHtml) {
            obj.contentHtml = contentHtml.replace(/\"images\//g, `"${prefixUrl}images/`)
          }
        }

        return obj
      }
    }
  } catch (exception) {
    console.warn(`loadContent - ${filePath}, ${exception}`, exception)
  }

  return null
}

/**
 * Scans a directory of /images and returns information on the image files
 * @param contentsPath Path to contents directory, eg. contents/biomarkers, contents/organizations, etc.
 * @param contentId The id of the content that we need images for (all related image names start with this id)
 * @param locale The locale directory to be scanned
 * @returns An array of objects with the image name, path, width and height
 */
export async function loadContentImages(
  contentsPath: string,
  contentId: string,
  locale: string = DEFAULT_LOCALE
): Promise<ContentImage[]> {
  assertLocale(locale)

  if (locale != DEFAULT_LOCALE) {
    const localizedDir = path.join(contentsPath, locale)
    assert(await fsExists(localizedDir), `loadContentImages - localized directory ${localizedDir} does not exist`)
  }

  const images = []
  contentsPath = path.join(contentsPath, "/images")
  if (await fsExists(contentsPath)) {
    const fileNames = await fs.readdir(contentsPath)
    for (const fileName of fileNames) {
      if (fileName.startsWith(contentId)) {
        const filePath = path.join(contentsPath, fileName)
        const fileExtension = path.extname(filePath).toLowerCase()
        if (fileExtension && [".png", ".jpg", ".jpeg", ".svg"].indexOf(fileExtension) != -1) {
          const imageSize = sizeOf(filePath)
          images.push({
            name: fileName,
            path: filePath,
            type: imageSize.type,
            width: imageSize.width,
            height: imageSize.height,
          })
        }
      }
    }
  }

  return images && images.length > 0 ? images : undefined
}
