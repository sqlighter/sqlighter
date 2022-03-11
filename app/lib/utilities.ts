//
// utilities.ts
//

import fs from "fs/promises"

export const HIGH_CONFIDENCE = 1.0
export const MEDIUM_CONFIDENCE = 0.75
export const LOW_CONFIDENCE = 0.5

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

/** Returns true if file or directory exists and can be accessed */
export async function fsExists(filePath): Promise<boolean> {
  return await fs.access(filePath).then(
    () => true,
    () => false
  )
}
