//
// sqlite.test.ts
//

import { DataConnectionConfigs } from "../connections"
import { SqliteDataConnection } from "./sqlite"
import initSqlJs, { Database, QueryExecResult } from "sql.js"
import fs from "fs"

function printThis(value) {
  console.log(JSON.stringify(value, null, " "))
}

// Interpreting schema
// https://www.sqlite.org/schematab.html
// AST tool
// https://astexplorer.net/

// client side testing
// https://jestjs.io/docs/configuration#testenvironment-string

async function getChinookConnection() {
  // create sqlite engine
  const engine = await initSqlJs({
    // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
    // You can omit locateFile completely when running in node
    // locateFile: file => `https://sql.js.org/dist/${file}`
  })

  const configs: DataConnectionConfigs = {
    client: "sqlite3",
    connection: {
      database: "chinook.db",
      buffer: fs.readFileSync("./lib/sqltr/databases/test/chinook.db"),
    },
  }
  return await SqliteDataConnection.create(configs, engine)
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
    expect(result.values[0][0]).toBe("3.36.0")
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

  test("getSchema (chinook.db)", async () => {
    const connection = await getChinookConnection()
    const schemas = await connection.getSchemas(false)
    expect(schemas).toBeTruthy()
    expect(schemas.length).toBe(1)

    const schema = schemas[0]
    // TODO SqliteDataConnection.getSchema - index: playlist_track doesn't have a SQL schema

    // save schema for verification
    const json = JSON.stringify(schema, null, "  ")
    fs.writeFileSync("./lib/sqltr/databases/test/chinook.schema.json", json)

    // save sql for verification
    const sql = []
    for (const tbl of schema.tables) {
      sql.push(tbl.sql)
      if (tbl.indexes) {
        for (const idx of tbl.indexes) {
          sql.push(idx.sql)
        }
      }
    }
    const sqlJoin = sql.join(";\n\n")
    fs.writeFileSync("./lib/sqltr/databases/test/chinook.sql", sqlJoin)

    const tableNames = schema.tables.map((t) => t.name).join(", ")
    expect(tableNames).toBe(
      "albums, artists, customers, employees, genres, invoice_items, invoices, media_types, playlist_track, playlists, tracks"
    )

    const tableColumns = schema.tables.map((t) => t.columns?.length).join(", ")
    expect(tableColumns).toBe("3, 2, 13, 15, 2, 5, 9, 2, 2, 2, 9")

    const indexNames = schema.tables
      .map((t) => (t.indexes ? t.indexes.map((i) => i.name).join(" ") : undefined))
      .join(" ")
    expect(indexNames).toBe(
      "IFK_AlbumArtistId  IFK_CustomerSupportRepId IFK_EmployeeReportsTo  IFK_InvoiceLineInvoiceId IFK_InvoiceLineTrackId IFK_InvoiceCustomerId  IFK_PlaylistTrackTrackId  IFK_TrackAlbumId IFK_TrackGenreId IFK_TrackMediaTypeId"
    )
  })

  test("getTree (chinook.db)", async () => {
    const connection = await getChinookConnection()
    const tree = await connection.getTrees(false)
    expect(tree).toBeTruthy()
    expect(tree.length).toBe(1)

    // save for verification
    const json = JSON.stringify(tree, null, "  ")
    fs.writeFileSync("./lib/sqltr/databases/test/chinook.tree.json", json)

    const root = tree[0]
    expect(root.id).toBe("chinook.db")
    expect(root.title).toBe("chinook.db")
    expect(root.icon).toBe("database")
    expect(root.children.length).toBe(3)
    const rootTitles = root.children.map((c) => c.title).join(", ")
    expect(rootTitles).toBe("Tables, Triggers, Views")

    const tables = root.children[0]
    expect(tables.id).toBe("chinook.db/tables")
    expect(tables.title).toBe("Tables")
    expect(tables.icon).toBe("table")
    expect(tables.badge).toBe("11")
    expect(tables.children.length).toBe(11)
    const tablesTitles = tables.children.map((c) => c.title).join(", ")
    expect(tablesTitles).toBe(
      "albums, artists, customers, employees, genres, invoice_items, invoices, media_types, playlist_track, playlists, tracks"
    )

    const albums = tables.children[0]
    expect(albums.id).toBe("chinook.db/tables/albums")
    expect(albums.title).toBe("albums")
    expect(albums.icon).toBeUndefined()
    expect(albums.badge).toBeUndefined()
    expect(albums.children.length).toBe(2) // columns, indexes

    const albumsColumns = albums.children[0]
    expect(albumsColumns.id).toBe("chinook.db/tables/albums/columns")
    expect(albumsColumns.title).toBe("Columns")
    expect(albumsColumns.icon).toBeUndefined()
    expect(albumsColumns.badge).toBe("3")
    expect(albumsColumns.children.length).toBe(3)
    const albumsColumnsTitles = albumsColumns.children.map((c) => c.title).join(", ")
    expect(albumsColumnsTitles).toBe("AlbumId, Title, ArtistId")

    const albumIdColumn = albumsColumns.children[0]
    expect(albumIdColumn.id).toBe("chinook.db/tables/albums/columns/AlbumId")
    expect(albumIdColumn.title).toBe("AlbumId")
    expect(albumIdColumn.tags[0]).toBe("primary key")
    expect(albumIdColumn.tags[1]).toBe("auto increment")
    expect(albumIdColumn.tags[2]).toBe("not null")
    expect(albumIdColumn.tags[3]).toBe("integer")
    expect(albumIdColumn.icon).toBeUndefined()
    expect(albumIdColumn.badge).toBeUndefined()
    expect(albumIdColumn.children).toBeUndefined()

    const titleColumn = albumsColumns.children[1]
    expect(titleColumn.id).toBe("chinook.db/tables/albums/columns/Title")
    expect(titleColumn.title).toBe("Title")
    expect(titleColumn.tags[0]).toBe("not null")
    expect(titleColumn.tags[1]).toBe("nvarchar(160)")
    expect(titleColumn.icon).toBeUndefined()
    expect(titleColumn.badge).toBeUndefined()
    expect(titleColumn.children).toBeUndefined()
  })
})
