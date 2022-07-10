/**
 * csv.ts
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom"
import * as fs from "node:fs"

import { importCsv } from "./csv"
import { getBlankConnection } from "./test/utilities"

// collection of csv test files
// https://github.com/mafintosh/csv-parser/tree/master/test/fixtures

async function getCsv(filename) {
  return fs.readFileSync(`./lib/test/csv/${filename}`, "utf-8")
}

describe("csv.ts (jsdom)", () => {
  test("isJsdom", () => {
    expect(window).toBeTruthy()
  })

  test("importCsv (cities.csv)", async () => {
    const fromCsv = await getCsv("cities.csv")
    const toConnection = await getBlankConnection()

    const csvResults = await importCsv(fromCsv, toConnection)
    expect(csvResults.database).toBe("main")
    expect(csvResults.table).toBe("Data")
    expect(csvResults.columns).toHaveLength(10)
    expect(csvResults.columns.join(",")).toBe("LatD,LatM,LatS,NS,LonD,LonM,LonS,EW,City,State")
    expect(csvResults.rows).toBe(128)

    // check data in table
    const sql = `select * from '${csvResults.table}' limit 10`
    const sqlResult = await toConnection.getResult(sql)
    expect(sqlResult.columns).toHaveLength(10)
    expect(sqlResult.columns.join(",")).toBe("LatD,LatM,LatS,NS,LonD,LonM,LonS,EW,City,State")
    expect(sqlResult.values[0].join(",")).toBe("41,5,59,N,80,39,0,W,Youngstown,OH")
    expect(sqlResult.values[1].join(",")).toBe("42,52,48,N,97,23,23,W,Yankton,SD")

    // check database schema
    const schemas = await toConnection.getSchemas(true)
    expect(schemas).toHaveLength(1)
    const schema = schemas[0]
    expect(schema.tables).toHaveLength(1)
    const table = schema.tables[0]
    expect(table.name).toBe(csvResults.table)
    expect(table.stats?.rows).toBe(128)
  })
})
