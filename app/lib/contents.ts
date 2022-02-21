//
// translations.ts
//

import path from "path"
import matter from "gray-matter"
import fs from "fs"
import assert from "assert"
import sizeOf from "image-size"

import Fuse from "fuse.js"
import Tokenizr from "tokenizr"

import { round } from "./utilities"
import { Unit } from "./units"
import { Metadata } from "./metadata"
import { Organization } from "./organizations"

export const BIOMARKERS_SEARCH_CONFIDENCE = 0.7
export const UNITS_SEARCH_CONFIDENCE = 0.7

export const DEFAULT_LOCALE = "en-US"

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

export class ContentReference {
  /** Content title, eg. Glucose (localized) */
  title?: string

  /** Main url of this content reference */
  url?: string

  /** An image that can be used to represent this content */
  imageUrl?: string

  /** An optional link to YouTube if this is a video content */
  videoUrl?: string
}

/** A piece of content like an article, topic, a biomarker, unit, etc */
export abstract class Content extends ContentReference {
  public constructor() {
    super()
  }

  /** Content id, eg. glucose */
  id: string

  /** Content title, eg. Glucose (localized) */
  title: string = ""

  /** A short description, eg. Blood sugar (localized) */
  description: string = ""

  /** Content's page content in markdown format (localized) */
  content: string = ""

  /** Current publication status */
  status: "draft" | "published" | "archived" = "draft"

  /** Links to external contents (either plain urls or reference objects) */
  references?: (string | ContentReference)[]

  /** Ids of biomarkers related to this content */
  biomarkers?: string[]

  /** Foods related to this content */
  foods?: string[]

  /** Miscellaneous tags */
  tags?: string[]

  /** Other names by which this biomarker is known (localized) */
  aliases?: string[]

  //
  // public methods
  //

  public static fromObject<T extends Content = Content>(obj: any, TCreator: new () => T): T {
    if (!obj.id) {
      console.error(`Content.fromObject - object missing id field`, obj)
      assert(obj.id)
    }
    return Object.assign(new TCreator(), obj)
  }

  //
  // static methods
  //

  /** Concrete class defines content type, eg. biomarker, topic, post, organization, etc... */
  public static get contentType() {
    return undefined
  }

  /** Concrete class loads contents from local file system or wherever */
  public static getContents(locale: string = DEFAULT_LOCALE): { [contentId: string]: Content } {
    return undefined
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

export function loadContents<T extends Content>(
  contentType: string,
  locale: string = DEFAULT_LOCALE,
  TCreator: new () => T
): { [contentId: string]: T } {
  // if contents already loaded, return cached version
  if (_contentsCache[contentType]?.[locale]) {
    return _contentsCache[contentType][locale] as unknown as { [contentId: string]: T }
  }

  assertLocale(locale)
  const contentsDirectory = path.resolve(`./contents/${contentType}s`)
  const contents = {}

  if (locale != DEFAULT_LOCALE) {
    const localizedDir = path.join(contentsDirectory, locale)
    assert(fs.existsSync(localizedDir), `loadContents - localized directory ${localizedDir} does not exist`)
  }

  const fileNames = fs.readdirSync(contentsDirectory)
  for (const fileName of fileNames) {
    const filePath = path.join(contentsDirectory, fileName)
    if (!filePath.startsWith(".") && filePath.endsWith(".md") && fs.statSync(filePath).isFile()) {
      const item = getContentFile(filePath, locale)
      if (item) {
        const content = Object.assign(new TCreator(), item)
        if (content.imageUrl && content.imageUrl.startsWith("images/")) {
          // TODO should normalize to url? absolute path? / path?
        }

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

export function getContentFiles(directoryPath: string, locale: string = DEFAULT_LOCALE): any[] {
  assertLocale(locale)
  const items = []

  if (locale != DEFAULT_LOCALE) {
    const localizedDir = path.join(directoryPath, locale)
    assert(fs.existsSync(localizedDir), `getContentFiles - localized directory ${localizedDir} does not exist`)
  }

  const fileNames = fs.readdirSync(directoryPath)
  for (const fileName of fileNames) {
    const filePath = path.join(directoryPath, fileName)
    if (!filePath.startsWith(".") && filePath.endsWith(".md") && fs.statSync(filePath).isFile()) {
      const item = getContentFile(filePath, locale)
      if (item) {
        items.push(item)
      }
    }
  }

  return items
}

export function getContentFile(filePath: string, locale: string = DEFAULT_LOCALE): object | null {
  assertLocale(locale)
  try {
    const fileContents = fs.readFileSync(filePath, "utf8")
    assert(fileContents, `getContentFile - ${filePath} can't be read`)
    if (fileContents) {
      const fileMatter = matter<string, null>(fileContents)
      assert(fileMatter.data, `getContentFile - ${filePath} is empty`)
      if (fileMatter.data) {
        const obj = { content: fileMatter.content, ...fileMatter.data }

        if (locale != DEFAULT_LOCALE) {
          const basePath = path.parse(filePath)
          const localizedPath = path.join(basePath.dir, locale, basePath.base)
          const localizedDir = path.parse(localizedPath).dir
          assert(fs.existsSync(localizedDir), `getContentFile - localized directory ${localizedDir} does not exist`)

          if (fs.existsSync(localizedPath)) {
            const localizedContents = fs.readFileSync(localizedPath, "utf8")
            if (localizedContents) {
              const localizedMatter = matter(localizedContents)
              if (localizedMatter.data) {
                const localizedObj = { content: localizedMatter.content, ...localizedMatter.data }
                Object.assign(obj, localizedObj)
              }
            }
          }
        }

        return obj
      }
    }
  } catch (exception) {
    console.warn(`getContentFile - ${filePath}, ${exception}`, exception)
  }
  return null
}

/**
 * Scans a directory of /images and returns information on the image files
 * @param contentsPath Path to contents directory, eg. contents/biomarkers, contents/organizations, etc.
 * @param locale The locale directory to be scanned
 * @returns An array of objects with the image name, path, width and height
 */
export function getContentImages(contentsPath: string, locale: string = DEFAULT_LOCALE): ContentImage[] {
  assertLocale(locale)
  const images = []

  if (locale != DEFAULT_LOCALE) {
    const localizedDir = path.join(contentsPath, locale)
    assert(fs.existsSync(localizedDir), `getContentImages - localized directory ${localizedDir} does not exist`)
  }

  contentsPath = path.join(contentsPath, "/images")
  const fileNames = fs.readdirSync(contentsPath)
  for (const fileName of fileNames) {
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

  return images
}
