//
// sqlite.test.ts
//

import { DataConnectionConfigs } from "../connections"
import { SqliteDataConnection } from "./sqlite"
import { Database, QueryExecResult } from "sql.js"
import fs from "fs"

function printThis(value) {
  console.log(JSON.stringify(value, null, " "))
}

// Interpreting schema
// https://www.sqlite.org/schematab.html
// AST tool
// https://astexplorer.net/

async function getChinookConnection() {
  const configs: DataConnectionConfigs = {
    client: "sqlite3",
    connection: {
      buffer: fs.readFileSync("./lib/sqltr/databases/test/chinook.sqlite"),
    },
  }
  return await SqliteDataConnection.create(configs)
}

describe("sqlite.ts", () => {
  
  test("getResult (single select)", async () => {
    const connection = await getChinookConnection()
    const result = await connection.getResult("select 10 'Colonna'")
    console.log(result)

    expect(result.columns.length).toBe(1)
    expect(result.columns[0]).toBe("Colonna")

    expect(result.values.length).toBe(1)
    expect(result.values[0].length).toBe(1)
    expect(result.values[0][0]).toBe(10)
  })

  test("getResult (sqlite_version)", async () => {
    const connection = await getChinookConnection()
    const result = await connection.getResult("select sqlite_version()")
    console.log(result)

    expect(result.columns.length).toBe(1)
    expect(result.columns[0]).toBe("sqlite_version()")

    expect(result.values.length).toBe(1)
    expect(result.values[0].length).toBe(1)
    expect(result.values[0][0]).toBe('3.36.0')
  })
  
  test("getResults (multiple selects)", async () => {
    const connection = await getChinookConnection()
    const results = await connection.getResults("select 10 'Colonna1'; select 20 'Colonna2';")
    expect(results.length).toBe(2)
    console.log(results)

    const result0 = results[0]
    expect(result0.columns.length).toBe(1)
    expect(result0.columns[0]).toBe("Colonna1")
    expect(result0.values.length).toBe(1)
    expect(result0.values[0].length).toBe(1)
    expect(result0.values[0][0]).toBe(10)

    const result1 = results[1]
    expect(result1.columns.length).toBe(1)
    expect(result1.columns[0]).toBe("Colonna2")
    expect(result1.values.length).toBe(1)
    expect(result1.values[0].length).toBe(1)
    expect(result1.values[0][0]).toBe(20)
  })

  test("getSchema", async () => {
    const connection = await getChinookConnection()
    const schema = await connection.getSchema(false)
    // TODO SqliteDataConnection.getSchema - index: playlist_track doesn't have a SQL schema

    expect(schema).toBeTruthy()
    expect(schema.length).toBe(21)
    for(const entity of schema) {
      expect(["table", "index"].includes(entity.type)).toBeTruthy()
    }

    const entities = schema.map((s) => s.type + ": " + s.name + "\n").join("")
    console.debug(entities)

    // tables
    const tables = schema.filter((s) => s.type === "table")
    const tableNames = tables.map((s) => s.name).join(", ")
    expect(tables.length).toBe(11)
    expect(tableNames).toBe(
      "albums, artists, customers, employees, genres, invoice_items, invoices, media_types, playlist_track, playlists, tracks"
    )

    // indexes
    const indexes = schema.filter((s) => s.type === "index")
    const indexNames = indexes.map((s) => s.name).join(", ")
    expect(indexes.length).toBe(10)
    expect(indexNames).toBe(
      "IFK_AlbumArtistId, IFK_CustomerSupportRepId, IFK_EmployeeReportsTo, IFK_InvoiceCustomerId, IFK_InvoiceLineInvoiceId, IFK_InvoiceLineTrackId, IFK_PlaylistTrackTrackId, IFK_TrackAlbumId, IFK_TrackGenreId, IFK_TrackMediaTypeId"
    )

    // save schema and sql for verification
    const json = JSON.stringify(schema, null, "  ")
    fs.writeFileSync("./lib/sqltr/databases/test/chinook.json", json)
    const sql = schema.map(s => s.sql).join("\n\n")
    fs.writeFileSync("./lib/sqltr/databases/test/chinook.sql", sql)
  })
})
