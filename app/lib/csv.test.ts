/**
 * csv.ts
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom"
import * as fs from "node:fs"

import { importCsv, exportCsv, validateColumnNames } from "./csv"
import { getBlankConnection } from "./test/utilities"

// collection of csv test files, thanks @mafintosh
// https://github.com/mafintosh/csv-parser/tree/master/test/fixtures

describe("csv.ts (jsdom)", () => {
  test("isJsdom", () => {
    expect(window).toBeTruthy()
  })

  test("validateColumnNames", () => {
    // basic
    let columns = validateColumnNames(["a", "b", "c"])
    expect(columns).toStrictEqual(["a", "b", "c"])

    // missing name
    columns = validateColumnNames(["", "b", "c"])
    expect(columns).toStrictEqual(["Col_1", "b", "c"])

    // null name
    columns = validateColumnNames([null, "b", "c"])
    expect(columns).toStrictEqual(["Col_1", "b", "c"])

    // null names
    columns = validateColumnNames([null, null, null])
    expect(columns).toStrictEqual(["Col_1", "Col_2", "Col_3"])

    // duplicate names
    columns = validateColumnNames(["a", "b", "a", "a"])
    expect(columns).toStrictEqual(["a", "b", "a_1", "a_2"])

    // duplicate names with conflicting naming scheme
    columns = validateColumnNames(["a", null, "Col_1", "Col_2", "a"])
    expect(columns).toStrictEqual(["a", "Col_2", "Col_1", "Col_2_1", "a_1"])
  })

  test("importCsv (cities.csv)", async () => {
    const fromCsv = await getCsv("cities.csv")
    const toConnection = await getBlankConnection()

    const csvResults = await importCsv(fromCsv, toConnection)
    expect(csvResults.database).toBe("main")
    expect(csvResults.table).toBe("Data")
    expect(csvResults.columns).toHaveLength(10)
    expectJoined(csvResults.columns).toBe("LatD,LatM,LatS,NS,LonD,LonM,LonS,EW,City,State")
    expect(csvResults.rows).toBe(128)

    // check data in table
    const sql = `select * from '${csvResults.table}' limit 10`
    const sqlResult = await toConnection.getResult(sql)
    expect(sqlResult.columns).toHaveLength(10)
    expectJoined(sqlResult.columns).toBe("LatD,LatM,LatS,NS,LonD,LonM,LonS,EW,City,State")
    expectJoined(sqlResult.values[0]).toBe("41,5,59,N,80,39,0,W,Youngstown,OH")
    expectJoined(sqlResult.values[1]).toBe("42,52,48,N,97,23,23,W,Yankton,SD")

    // check database schema
    const schemas = await toConnection.getSchemas(true)
    expect(schemas).toHaveLength(1)
    const schema = schemas[0]
    expect(schema.tables).toHaveLength(1)
    const table = schema.tables[0]
    expect(table.name).toBe(csvResults.table)
    expect(table.stats?.rows).toBe(128)
  })

  /** Check basics */
  test("importCsv (basic.csv)", async () => {
    const { csvResult, sqlResult, sqlSchema } = await processCsv("basic.csv")

    expect(csvResult.columns).toHaveLength(3)
    expectJoined(csvResult.columns).toBe("a,b,c")
    expect(csvResult.rows).toBe(1)

    // check data in table
    expect(sqlResult.columns).toHaveLength(3)
    expectJoined(sqlResult.columns).toBe("a,b,c")
    expectJoined(sqlResult.values[0]).toBe("1,2,3")

    // check database schema
    const table = sqlSchema.tables[0]
    expect(table.name).toBe(csvResult.table)
    expect(table.stats?.rows).toBe(1)
  })

  /** Header with quotes in names and extra padding whitespace */
  test("importCsv (cities.csv)", async () => {
    const { csvResult, sqlResult, sqlSchema } = await processCsv("cities.csv")

    expect(csvResult.columns).toHaveLength(10)
    expectJoined(csvResult.columns).toBe("LatD,LatM,LatS,NS,LonD,LonM,LonS,EW,City,State")
    expect(csvResult.rows).toBe(128)

    // check data in table
    expect(sqlResult.columns).toHaveLength(10)
    expectJoined(sqlResult.columns).toBe("LatD,LatM,LatS,NS,LonD,LonM,LonS,EW,City,State")
    expectJoined(sqlResult.values[0]).toBe("41,5,59,N,80,39,0,W,Youngstown,OH")
    expectJoined(sqlResult.values[1]).toBe("42,52,48,N,97,23,23,W,Yankton,SD")

    // check database schema
    const table = sqlSchema.tables[0]
    expect(table.name).toBe(csvResult.table)
    expect(table.stats?.rows).toBe(128)
  })

  /** Check order of rows */
  test("importCsv (airtravel.csv)", async () => {
    const { csvResult, sqlResult } = await processCsv("airtravel.csv")

    expect(csvResult.columns).toHaveLength(4)
    expectJoined(csvResult.columns).toBe("Month,1958,1959,1960")
    expect(csvResult.rows).toBe(12)

    // check data in table
    expect(sqlResult.columns).toHaveLength(4)
    expectJoined(sqlResult.columns).toBe("Month,1958,1959,1960") // columns
    expectJoined(sqlResult.values[0]).toBe("JAN,340,360,417") // rows
    const months = sqlResult.values.map((v) => v[0])
    expectJoined(months).toBe("JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEP,OCT,NOV,DEC") // order of rows
  })

  /** Bad header row, missing fields */
  test("importCsv (bad-data.csv)", async () => {
    const { csvResult, sqlResult } = await processCsv("bad-data.csv")

    expect(csvResult.columns).toHaveLength(3)
    expectJoined(csvResult.columns).toBe("Col_1,somejunk,<! />")
    expect(csvResult.rows).toBe(3)

    // check data in table
    expect(sqlResult.columns).toHaveLength(3)
    expectJoined(sqlResult.columns).toBe("Col_1,somejunk,<! />") // column names
    expectJoined(sqlResult.values[0]).toBe("NULL,nope,NULL") // first row
    const firstColumnValues = sqlResult.values.map((v) => v[0])
    expectJoined(firstColumnValues).toBe("NULL,yes,ok")
  })

  /** Comma inside quotes */
  test("importCsv (comma-in-quote.csv)", async () => {
    const { csvResult, sqlResult } = await processCsv("comma-in-quote.csv")

    expect(csvResult.columns).toHaveLength(5)
    expect(sqlResult.columns).toHaveLength(5)
    expectJoined(sqlResult.columns).toBe("first,last,address,city,zip")
    expect(sqlResult.values).toHaveLength(1)

    // what you would like to have...
    // expectJoined(sqlResult.values[0]).toBe("John,Doe,120 any st.,Anytown, WW,08123")
    // TODO what you actually have, zero removed from zip code, can it be fixed?
    expectJoined(sqlResult.values[0]).toBe("John,Doe,120 any st.,Anytown, WW,8123")
  })

  /** Comments using # ... */
  test("importCsv (comment.csv)", async () => {
    const { csvResult, sqlResult } = await processCsv("comment.csv")

    expect(csvResult.columns).toHaveLength(3)
    expectJoined(csvResult.columns).toBe("a,b,c")
    expect(csvResult.rows).toBe(1) // 1 line of comments, 1 line of header, 1 line of data, 1 empty line

    // check data in table
    expect(sqlResult.columns).toHaveLength(3)
    expectJoined(sqlResult.columns).toBe("a,b,c") // column names
    expect(sqlResult.values).toHaveLength(1)
    expectJoined(sqlResult.values[0]).toBe("1,2,3") // first row
  })

  /** Missing header, empty columns, missing names should be replaced */
  test("importCsv (empty-columns.csv)", async () => {
    const { csvResult, sqlResult } = await processCsv("empty-columns.csv")

    // TODO Csv / should figure out when header is missing? how? #87
    expect(csvResult.columns).toHaveLength(3)
    expectJoined(csvResult.columns).toBe("2007-01-01,Col_2,Col_3") // made up column names
    expect(csvResult.rows).toBe(1) // 1 line of data that is misunderstood as header, 1 line of data, 1 empty line

    // check data in table
    expect(sqlResult.columns).toHaveLength(3)
    expectJoined(sqlResult.columns).toBe("2007-01-01,Col_2,Col_3") // column names made up
    expect(sqlResult.values).toHaveLength(1)
    expectJoined(sqlResult.values[0]).toBe("2007-01-02,NULL,NULL")
  })

  /** Using duoble quotes to escape double quotes */
  test("importCsv (escape-quotes.csv)", async () => {
    const { csvResult, sqlResult } = await processCsv("escape-quotes.csv")

    expect(csvResult.columns).toHaveLength(2)
    expectJoined(csvResult.columns).toBe("a,b")
    expect(csvResult.rows).toBe(3)

    expect(sqlResult.columns).toHaveLength(2)
    expectJoined(sqlResult.columns).toBe("a,b")
    expect(sqlResult.values).toHaveLength(3)
    expectJoined(sqlResult.values[0]).toBe('1,ha "ha" ha')
    expect(sqlResult.values[1][1]).toBe(null)
    expectJoined(sqlResult.values[1]).toBe("2,NULL")
    expectJoined(sqlResult.values[2]).toBe("3,4")
  })

  /** Json in fields */
  test("importCsv (geojson.csv)", async () => {
    const { csvResult, sqlResult } = await processCsv("geojson.csv")

    expect(csvResult.columns).toHaveLength(4)
    expectJoined(csvResult.columns).toBe("id,prop0,prop1,geojson")
    expect(csvResult.rows).toBe(3)

    expect(sqlResult.columns).toHaveLength(4)
    expectJoined(sqlResult.columns).toBe("id,prop0,prop1,geojson")
    expect(sqlResult.values).toHaveLength(3)
    expectJoined(sqlResult.values[0]).toBe('NULL,value0,NULL,{"type": "Point", "coordinates": [102.0, 0.5]}')
    expectJoined(sqlResult.values[1]).toBe(
      'NULL,value0,0,{"type": "LineString", "coordinates": [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]]}'
    )
    expectJoined(sqlResult.values[2]).toBe(
      'NULL,value0,{u\'this\': u\'that\'},{"type": "Polygon", "coordinates": [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]]}'
    )
  })

  /** Large-ish dataset */
  test("importCsv (large-dataset.csv)", async () => {
    const { csvResult, sqlResult } = await processCsv("large-dataset.csv", 10000)

    expect(csvResult.columns).toHaveLength(15)
    expectJoined(csvResult.columns).toBe(
      "time,latitude,longitude,depth,mag,magType,nst,gap,dmin,rms,net,id,updated,place,type"
    )
    expect(csvResult.rows).toBe(7268)

    expect(sqlResult.columns).toHaveLength(15)
    expectJoined(sqlResult.columns).toBe(
      "time,latitude,longitude,depth,mag,magType,nst,gap,dmin,rms,net,id,updated,place,type"
    )
    expect(sqlResult.values).toHaveLength(7268)
    expectJoined(sqlResult.values[0]).toBe(
      "2015-12-22T18:45:11.000Z,59.9988,-152.7191,100,3,ml,NULL,NULL,NULL,0.54,ak,ak12293661,2015-12-22T19:09:29.736Z,54km S of Redoubt Volcano, Alaska,earthquake"
    )
    expectJoined(sqlResult.values[1]).toBe(
      "2015-12-22T18:38:34.000Z,62.9616,-148.7532,65.4,1.9,ml,NULL,NULL,NULL,0.51,ak,ak12293651,2015-12-22T18:47:23.287Z,48km SSE of Cantwell, Alaska,earthquake"
    )
    expectJoined(sqlResult.values[2]).toBe(
      "2015-12-22T18:38:01.820Z,19.2129993,-155.4179993,33.79,2.56,ml,56,142,0.03113,0.21,hv,hv61132446,2015-12-22T18:44:13.729Z,6km E of Pahala, Hawaii,earthquake"
    )
  })

  /** Mixed quotes and newlines */
  test("importCsv (quotes+newlines.csv)", async () => {
    const { csvResult, sqlResult } = await processCsv("quotes+newlines.csv")

    expect(csvResult.columns).toHaveLength(2)
    expectJoined(csvResult.columns).toBe("a,b")
    expect(csvResult.rows).toBe(3)

    expect(sqlResult.columns).toHaveLength(2)
    expectJoined(sqlResult.columns).toBe("a,b")
    expect(sqlResult.values).toHaveLength(3)
    expect(sqlResult.values[0][0]).toBe(1)
    expect(sqlResult.values[0][1]).toBe('ha \n"ha" \nha')
    expectJoined(sqlResult.values[1]).toBe("2,NULL")
    expectJoined(sqlResult.values[2]).toBe("3,4")
  })

  /** Utf-8 encoding */
  test("importCsv (ut8.csv)", async () => {
    const { sqlResult } = await processCsv("utf8.csv")
    // did you know this? https://en.wikipedia.org/wiki/Voiced_postalveolar_affricate
    expectJoined(sqlResult.values[1]).toBe("4,5,ʤ")
  })

  test("exportCsv (basic)", async () => {
    const csv = exportCsv(
      ["first", "last"],
      [
        ["John", "Doe"],
        ["Jane", "Smith"],
      ]
    )
    expect(csv).toBe("first,last\r\nJohn,Doe\r\nJane,Smith")
  })

  test("exportCsv (quotes)", async () => {
    const csv = exportCsv(
      ["Single\"Quote", "Regular"],
      [
        ["John", "Doe"],
        ["Jane", "Smith"],
      ]
    )
    expect(csv).toBe('"Single""Quote",Regular\r\nJohn,Doe\r\nJane,Smith')
  })
})

//
// utilities
//

async function getCsv(filename) {
  return fs.readFileSync(`./lib/test/csv/${filename}`, "utf-8")
}

async function processCsv(filename, limit = 100) {
  const fromCsv = await getCsv(filename)
  const toConnection = await getBlankConnection()

  const csvResult = await importCsv(fromCsv, toConnection)
  expect(csvResult.database).toBe("main")
  expect(csvResult.table).toBe("Data")

  // check data in table
  const sql = `select * from '${csvResult.table}' limit ${limit}`
  const sqlResult = await toConnection.getResult(sql)

  // check database schema
  const sqlSchemas = await toConnection.getSchemas(true)
  expect(sqlSchemas).toHaveLength(1)
  const sqlSchema = sqlSchemas[0]
  expect(sqlSchema.tables).toHaveLength(1)
  const table = sqlSchema.tables[0]
  expect(table.name).toBe(csvResult.table)

  return { connection: toConnection, csvResult, sqlResult, sqlSchema }
}

/** Join values with commas but use SQL's 'NULL' for missing values */
function expectJoined(values: any[]) {
  const joined = values
    .map((v) => {
      if (v === null || v === undefined) {
        return "NULL"
      }
      return v.toString()
    })
    .join(",")
  return expect(joined)
}
