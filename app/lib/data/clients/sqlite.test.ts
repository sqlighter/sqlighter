//
// sqlite.test.ts
//

import fs from "fs"
import { getChinookConnection, getTestConnection, getNorthwindConnection, writeJson } from "../../test/utilities"

// Interpreting schema
// https://www.sqlite.org/schematab.html
// AST tool
// https://astexplorer.net/
// client side testing
// https://jestjs.io/docs/configuration#testenvironment-string

describe("sqlite.ts (node env)", () => {
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
    writeJson("./lib/test/artifacts/chinook.entities.json", entities)
  })

  test("getEntities (test.db)", async () => {
    const connection = await getTestConnection()
    const entities = await connection._getEntities()
    expect(entities).toBeTruthy()
    expect(entities.length).toBe(25)
    writeJson("./lib/test/artifacts/test.entities.json", entities)
  })

  test("getEntities (nortwind.db)", async () => {
    const connection = await getNorthwindConnection()
    const entities = await connection._getEntities()
    expect(entities).toBeTruthy()
    expect(entities.length).toBe(29)
    writeJson("./lib/test/artifacts/northwind.entities.json", entities)
  })

  test("getSchema (chinook.db)", async () => {
    const connection = await getChinookConnection()
    const schemas = await connection.getSchemas(false)
    expect(schemas).toBeTruthy()
    expect(schemas.length).toBe(1)

    const schema = schemas[0]
    // TODO SqliteDataConnection.getSchema - index: playlist_track doesn't have a SQL schema

    // save schema for verification
    writeJson("./lib/test/artifacts/chinook.schema.json", schema)

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
    fs.writeFileSync("./lib/test/artifacts/chinook.sql", sqlJoin)

    // list of tables, sorted alphabetically
    const tableNames = schema.tables.map((t) => t.name).join(", ")
    expect(tableNames).toBe(
      "albums, artists, customers, employees, genres, invoice_items, invoices, media_types, playlist_track, playlists, tracks"
    )

    // number of columns in each table
    const tableColumns = schema.tables.map((t) => t.columns?.length).join(", ")
    expect(tableColumns).toBe("3, 2, 13, 15, 2, 5, 9, 2, 2, 2, 9")

    // number of rows in each table
    const tableRowsStats = schema.tables.map((t) => t.stats.rows).join(", ")
    expect(tableRowsStats).toBe("347, 275, 59, 8, 25, 2240, 412, 5, 8715, 18, 3503")

    const indexNames = schema.tables
      .map((t) => (t.indexes ? t.indexes.map((i) => i.name).join(" ") : undefined))
      .join(" ")
    expect(indexNames).toBe(
      "IFK_AlbumArtistId  IFK_CustomerSupportRepId IFK_EmployeeReportsTo  IFK_InvoiceLineInvoiceId IFK_InvoiceLineTrackId IFK_InvoiceCustomerId  IFK_PlaylistTrackTrackId  IFK_TrackAlbumId IFK_TrackGenreId IFK_TrackMediaTypeId"
    )

    // total database size
    expect(schema.stats?.size).toBe(884736)
  })

  test("getSchema (test.db)", async () => {
    const connection = await getTestConnection()
    const schemas = await connection.getSchemas(false)
    expect(schemas).toBeTruthy()
    expect(schemas.length).toBe(1)

    const schema = schemas[0]
    // TODO SqliteDataConnection.getSchema - index: playlist_track doesn't have a SQL schema

    // save schema for verification
    writeJson("./lib/test/artifacts/test.schema.json", schema)

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
    fs.writeFileSync("./lib/test/artifacts/test.sql", sqlJoin)

    const triggersNames = schema.triggers.map((t) => t.name).join(", ")
    expect(triggersNames).toBe("validate_email_before_insert_customers")

    const viewsNames = schema.views.map((v) => v.name).join(" ")
    expect(viewsNames).toBe("customernames doublesales invoicetotals")
  })

  test("getSchema (northwind.db)", async () => {
    const connection = await getNorthwindConnection()
    const schemas = await connection.getSchemas(false)
    expect(schemas).toBeTruthy()
    expect(schemas.length).toBe(1)

    // save schema for verification
    const schema = schemas[0]
    writeJson("./lib/test/artifacts/northwind.schema.json", schema)

    expect(schema.tables).toHaveLength(13)
    const tablesNames = schema.tables.map((t) => `'${t.name}'`).join(", ")
    expect(tablesNames).toBe(
      "'Categories', 'CustomerCustomerDemo', 'CustomerDemographics', 'Customers', 'EmployeeTerritories', 'Employees', 'Order Details', 'Orders', 'Products', 'Regions', 'Shippers', 'Suppliers', 'Territories'"
    )
    
    expect(schema.views).toHaveLength(16)
    const viewsNames = schema.views.map((v) => `'${v.name}'`).join(", ")
    expect(viewsNames).toBe(
      "'Alphabetical list of products', 'Category Sales for 1997', 'Current Product List', 'Customer and Suppliers by City', 'Invoices', 'Order Details Extended', 'Order Subtotals', 'Orders Qry', 'Product Sales for 1997', 'Products Above Average Price', 'Products by Category', 'Quarterly Orders', 'Sales Totals by Amount', 'Sales by Category', 'Summary of Sales by Quarter', 'Summary of Sales by Year'"
    )

    // no triggers
    expect(schema.triggers).toHaveLength(0)
  })

  test("canExport (chinook.db)", async () => {
    const connection = await getChinookConnection()
    expect(connection.canExport()).toBeTruthy()
    expect(connection.canExport("main", "customers")).not.toBeTruthy()
  })

  test("export (chinook.db)", async () => {
    const connection = await getChinookConnection()
    const exportData = await connection.export()

    expect(exportData.data).toBeTruthy()
    expect(exportData.data.length).toBe(884736)
    expect(exportData.type).toBe("application/x-sqlite3")
  })
})
