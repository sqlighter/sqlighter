//
// translations.ts
//

import path from "path"
import matter from "gray-matter"
import fs from "fs"
import assert from "assert"
import sizeOf from "image-size"

export const DEFAULT_LOCALE = "en-US"

export function assertLocale(locale: string) {
  assert(/[a-z]{2}-[A-Z]{2}/.test(locale), `'${locale}' is an invalid locale (eg. en-US, it-IT...)`)
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

/** An image asset */
export interface ContentImages {
  name: string
  type: string
  width: number
  height: number

  /** Path of image in local file system */
  path?: string
  /** Url of image resource */
  url?: string
}

/**
 * Scans a directory of /images and returns information on the image files
 * @param contentsPath Path to contents directory, eg. contents/biomarkers, contents/organizations, etc.
 * @param locale The locale directory to be scanned
 * @returns An array of objects with the image name, path, width and height
 */
export function getContentImages(contentsPath: string, locale: string = DEFAULT_LOCALE): ContentImages[] {
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
