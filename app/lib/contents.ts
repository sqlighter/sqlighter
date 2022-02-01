//
// translations.ts
//

import path from "path"
import matter from "gray-matter"
import fs from "fs"
import assert from "assert"

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
    if (fs.statSync(filePath).isFile()) {
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
