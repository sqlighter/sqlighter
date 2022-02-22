//
// utilities.ts
//

// https://www.npmjs.com/package/axios
import axios from "axios"
import { assert } from "console"
import fs from "fs/promises"

export const HIGH_CONFIDENCE = 1.0
export const MEDIUM_CONFIDENCE = 0.75
export const LOW_CONFIDENCE = 0.5

export class Api {
  public static async getJson(relativeUrl: string): Promise<any> {
    assert(relativeUrl.startsWith("/"))
    const url = "https://api.biomarkers.app" + relativeUrl
    const token = "topolino"
    try {
      const results = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      return results.data
    } catch (exception) {
      console.error(`getApiJson - ${url}`, exception)
      throw exception
    }
  }
}

export async function getApiJson(relativeUrl: string) {
  assert(relativeUrl.startsWith("/"))
  const url = "https://api.insieme.app" + relativeUrl
  //	const url = 'http://localhost:8055' + relativeUrl;
  const token = "topolino"
  try {
    const results = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return results.data
  } catch (exception) {
    console.error(`getApiJson - ${url}`, exception)
    throw exception
  }
}

function _jsonReplacer(key: string, value: any) {
  if (key === "confidence" && typeof value === "number") {
    return round(value, 3)
  }
  if (key === "bbox" && Array.isArray(value)) {
    try {
      return "[" + value.map((p) => `[${round(p[0], 4)},${round(p[1], 4)}]`).join(",") + "]"
    } catch {}
  }
  return value
}

function _jsonReviver(key: string, value: any) {
  if (key === "bbox" && typeof value === "string") {
    try {
      const c1 = value
        .replace(/[\[\],]+/g, " ")
        .trim()
        .split(" ")
      const c2 = c1.map((c) => parseFloat(c))
      return [
        [c2[0], c2[1]],
        [c2[2], c2[3]],
        [c2[4], c2[5]],
        [c2[6], c2[7]],
      ]
    } catch {}
  }
  return value
}

/** Write given data to a json file */
export async function writeJson(jsonPath: string, jsonData: any) {
  try {
    const stringified = JSON.stringify(jsonData, _jsonReplacer, "\t")
    await fs.writeFile(jsonPath, stringified)
  } catch (exception) {
    console.error(`writeJson - ${jsonPath}, exception: ${exception}`, exception)
    throw exception
  }
}

/** Read json from a local file */
export async function readJson(jsonPath: string) {
  try {
    const stringified = (await fs.readFile(jsonPath)).toString()
    return JSON.parse(stringified, _jsonReviver)
  } catch (exception) {
    console.error(`readJson - ${jsonPath}, exception: ${exception}`, exception)
    throw exception
  }
}

/** Rounds number to two decimal digits at most */
export function round(value: number, digits: number = 2) {
  return parseFloat(value.toFixed(digits))
}
