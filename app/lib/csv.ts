/**
 * csv.ts - these utility methods work in the browser
 */

// https://www.papaparse.com
// https://www.npmjs.com/package/papaparse
import Papa from "papaparse"

import { DataConnection } from "./data/connections"

const CSV_QUOTES = ['"', "'", "`"]

/**
 * Import a csv file to a table in the given connection
 * @param fromSource Source is a .csv file that will be streamed or a string
 * @param toConnection Data connection we're writing to
 * @param toDatabase Database to write to or main if not specified
 * @param toTable Table name to be used, will use "Data" as default
 * @returns Returns stats about imported rows, etc
 */
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

  // remove trailing whitespace
  if (typeof fromSource === "string") {
    fromSource = fromSource.trimEnd()
  }

  // TODO table name from file name?
  toTable = toTable || "Data"
  let columns: string[] = null
  let rows = 0

  await papaParseAsync(fromSource, {
    //  worker: true,
    comments: "#",
    transform: trimCsvValue,
    dynamicTyping: true,
    step: (results) => {
      const record = results.data
      if (columns) {
        if (record.length == columns.length) {
          // insert record in table using params to avoid sql injection issues
          const values = record.map((_, index) => `:${index}`).join(",")
          const params = {}
          record.forEach((r, index) => {
            if (r instanceof Date) {
              r = r.toISOString()
            }
            params[`:${index}`] = r
          })
          const sql = `insert into '${toTable}' values (${values});`
          toConnection.getResultsSync(sql, params)
          rows++
        } else {
          console.warn(
            `importCsv - row ${rows + 1} has ${record.length} values but there are ${columns.length} columns`,
            results
          )
        }
      } else {
        // TODO Csv / should figure out when header is missing? how? #87
        // detect if columns header is missing and use Col1, Col2, Col3 instead
        columns = validateColumnNames(record)

        // create table where records will be inserted
        const sql = `create table '${toTable}' (${columns.map((col) => `'${col}'`).join(",")});`
        toConnection.getResultsSync(sql)
      }
    },
  })

  return { database: toDatabase, table: toTable, rows: rows, columns }
}

/** Papa.parse as a promise */
async function papaParseAsync<T=any>(source, options): Promise<Papa.ParseResult<T>> {
  return new Promise((resolve, reject) => {
    Papa.parse(source, {
      ...options,
      complete: (results: Papa.ParseResult<T>) => {
        return resolve(results)
      },
      error: (error: Papa.ParseError) => {
        return reject(error)
      },
    })
  })
}

/**
 * Export given data to a streamable blob of text contaning csv file
 * @param columns List of column names
 * @param values Array of arrays of row values
 * @returns A blob with .csv content
 */
export function exportCsv(columns: string[], values: any[][]): string {
  return Papa.unparse({
    fields: columns,
    data: values,
  })
}

/** Trim whitespace around value, remove containing quotes */
export function trimCsvValue(value) {
  if (value) {
    value = value.trim()
    for (const quote of CSV_QUOTES) {
      if (value.startsWith(quote) && value.endsWith(quote)) {
        value = value.slice(1, -1)
        break
      }
    }
  }

  return value?.length > 0 ? value : null
}

/** True if column appears more than once in columns before itself */
function hasDuplicates(columns, columnIndex): Boolean {
  for (let j = 0; j < columnIndex; j++) {
    if (columns[j] == columns[columnIndex]) {
      return true
    }
  }
  return false
}

/** Fix any column names that are missing, duplicated or invalid for SQL */
export function validateColumnNames(columns: string[]): string[] {
  const validated = [...columns]

  columns.forEach((column, index) => {
    if (!column) {
      validated[index] = `Col_${index + 1}`
    }

    // TODO should check if name is valid for SQL column

    let counter = 1
    while (hasDuplicates(validated, index)) {
      validated[index] = `${column}_${counter++}`
    }
  })

  return validated
}
