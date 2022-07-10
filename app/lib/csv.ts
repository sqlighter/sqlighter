/**
 * csv.ts - these utility methods work in the browser
 */

// https://www.papaparse.com
// https://www.npmjs.com/package/papaparse
import Papa from "papaparse"

import { DataConnection } from "./data/connections"


export async function importCsv(
  fromSource: File | string,
  toConnection: DataConnection,
  toDatabase?: string,
  toTable?: string
): Promise<{ database: string; table: string; columns: string[]; rows: number }> {
  if (!toDatabase) {
    const schemas = await toConnection.getSchemas(false)
    toDatabase = schemas[0].database
  }

  // TODO table name from file name?
  toTable = toTable || "Data"
  let columns = null
  let rows = 0

  const papaResult = await papaParseAsync(fromSource, {
  //  worker: true,

    transform: (value: string): string => {
      let trimmed = value.trim()
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return trimmed.slice(1, -1);
      }
      return trimmed
    },
    step: (results) => {
      console.log("Row:", results.data)
      const record = results.data
      if (columns) {
        if (record.length == columns.length) {
          // insert record in table
          const values = record.map((r) => `'${r}'`).join(",")
          const sql = `insert into '${toTable}' values (${values});`
          const results = toConnection.getResultsSync(sql)
          console.debug("written row", results)
          rows++
        } else {
          console.warn("parse warning", results)
        }
      } else {
        // TODO detect if columns header is missing and use Col1, Col2, Col3 instead
        columns = record

        // create table where records will be inserted
        const sql = `create table '${toTable}' (${record.map((col) => `'${col}'`).join(",")});`
        const results = toConnection.getResultsSync(sql)
        console.debug(sql, results)
      }
    },
  })

  console.debug("papa.parse", papaResult)

  return { database: toDatabase, table: toTable, rows: rows, columns }
}

/** Papa.parse as a promise */
export async function papaParseAsync(source, options): Promise<Papa.ParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(source, {
      ...options,
      complete: (results: Papa.ParseResult) => {
        return resolve(results)
      },
      error: (error: Papa.ParseError) => {
        return reject(error)
      },
    })
  })
}
