//
// sqlite.test.ts
//

import { DataConnectionConfigs } from "../connections"
import { SqliteDataConnection } from "./sqlite"
import initSqlJs, { Database, QueryExecResult } from "sql.js"
import fs from "fs"

function logJson(data) {
  console.log(JSON.stringify(data, null, " "))
}

function writeJson(filename, data) {
  const json = JSON.stringify(data, null, "  ")
  fs.writeFileSync(filename, json)
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
    locateFile: file => `https://sql.js.org/dist/${file}`
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

async function getTestConnection() {
  const engine = await initSqlJs()
  const configs: DataConnectionConfigs = {
    client: "sqlite3",
    connection: {
      database: "test.db",
      buffer: fs.readFileSync("./lib/sqltr/databases/test/test.db"),
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
    expect(result.values[0][0]).toBe("3.38.5")
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

  test("getEntities (chinook.db)", async () => {
    const connection = await getChinookConnection()
    const entities = await connection._getEntities()
    expect(entities).toBeTruthy()
    expect(entities.length).toBe(21)
    writeJson("./lib/sqltr/databases/test/chinook.entities.json", entities)
  })

  test("getEntities (test.db)", async () => {
    const connection = await getTestConnection()
    const entities = await connection._getEntities()
    expect(entities).toBeTruthy()
    expect(entities.length).toBe(25)
    writeJson("./lib/sqltr/databases/test/test.entities.json", entities)
  })

  test("getSchema (chinook.db)", async () => {
    const connection = await getChinookConnection()
    const schemas = await connection.getSchemas(false)
    expect(schemas).toBeTruthy()
    expect(schemas.length).toBe(1)

    const schema = schemas[0]
    // TODO SqliteDataConnection.getSchema - index: playlist_track doesn't have a SQL schema

    // save schema for verification
    writeJson("./lib/sqltr/databases/test/chinook.schema.json", schema)

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

  test("getSchema (test.db)", async () => {
    const connection = await getTestConnection()
    const schemas = await connection.getSchemas(false)
    expect(schemas).toBeTruthy()
    expect(schemas.length).toBe(1)

    const schema = schemas[0]
    // TODO SqliteDataConnection.getSchema - index: playlist_track doesn't have a SQL schema

    // save schema for verification
    writeJson("./lib/sqltr/databases/test/test.schema.json", schema)

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
    for (const trg of schema.triggers) {
      sql.push(trg.sql)
    }
    for (const view of schema.views) {
      sql.push(view.sql)
    }
    const sqlJoin = sql.join(";\n\n")
    fs.writeFileSync("./lib/sqltr/databases/test/test.sql", sqlJoin)

    const triggersNames = schema.triggers.map((t) => t.name).join(", ")
    expect(triggersNames).toBe("validate_email_before_insert_customers")

    const viewsNames = schema.views.map((v) => v.name).join(" ")
    expect(viewsNames).toBe("customernames doublesales invoicetotals")
  })
/*
  test("getTree (chinook.db)", async () => {
    const connection = await getChinookConnection()
    const tree = await connection.getSchemas(false)
    expect(tree).toBeTruthy()
    expect(tree.length).toBe(1)

    // save for verification
    writeJson("./lib/sqltr/databases/test/chinook.tree.json", tree)

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

  test("getTree (test.db)", async () => {
    const connection = await getTestConnection()
    const tree = await connection.getTrees(false)
    expect(tree).toBeTruthy()
    expect(tree.length).toBe(1)
    const root = tree[0]

    // save for verification
    writeJson("./lib/sqltr/databases/test/test.tree.json", tree)

    const triggers = root.children[1]
    expect(triggers.id).toBe("test.db/triggers")
    expect(triggers.title).toBe("Triggers")
    expect(triggers.icon).toBe("trigger")
    expect(triggers.badge).toBe("1")
    expect(triggers.children.length).toBe(1)
    const triggersTitles = triggers.children.map((c) => c.title).join(", ")
    expect(triggersTitles).toBe("validate_email_before_insert_customers")

    const views = root.children[2]
    expect(views.id).toBe("test.db/views")
    expect(views.title).toBe("Views")
    expect(views.icon).toBe("view")
    expect(views.badge).toBe("3")
    expect(views.children.length).toBe(3)
    const viewsTitles = views.children.map((c) => c.title).join(", ")
    expect(viewsTitles).toBe("customernames, doublesales, invoicetotals")
  })
*/
})
