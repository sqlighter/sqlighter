//
// sqlite.test.ts
//

import { getChinookConnection, getTestConnection, getNorthwindConnection, getBlankConnection, writeJson } from "../../test/utilities"

// Interpreting schema
// https://www.sqlite.org/pragma.html
// client side testing
// https://jestjs.io/docs/configuration#testenvironment-string

describe("sqlite.ts (node env)", () => {
  test("getResult (single select)", async () => {
    const connection = await getChinookConnection()
    const result = await connection.getResult("select 10 'Colonna'")

    expect(result.columns.length).toBe(1)
    expect(result.columns[0]).toBe("Colonna")

    expect(result.values.length).toBe(1)
    expect(result.values[0].length).toBe(1)
    expect(result.values[0][0]).toBe(10)
  })

  test("getResult (sqlite_version)", async () => {
    const connection = await getChinookConnection()
    const result = await connection.getResult("select sqlite_version()")

    expect(result.columns.length).toBe(1)
    expect(result.columns[0]).toBe("sqlite_version()")

    expect(result.values.length).toBe(1)
    expect(result.values[0].length).toBe(1)
    expect(result.values[0][0]).toBe("3.39.3")
  })

  test("getResults (multiple selects)", async () => {
    const connection = await getChinookConnection()
    const results = await connection.getResults("select 10 'Colonna1'; select 20 'Colonna2';")
    expect(results.length).toBe(2)

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
    expect(schema.database).toBe("main")

    // save schema for verification
    writeJson("./lib/test/artifacts/chinook.schema.json", schema)

    // list of tables, sorted alphabetically
    const tableNames = schema.tables.map((t) => `'${t.name}'`).join(", ")
    expect(tableNames).toBe(
      "'albums', 'artists', 'customers', 'employees', 'genres', 'invoice_items', 'invoices', 'media_types', 'playlist_track', 'playlists', 'tracks'"
    )
    // number of columns in each table
    const tableColumns = schema.tables.map((t) => t.columns?.length).join(", ")
    expect(tableColumns).toBe("3, 2, 13, 15, 2, 5, 9, 2, 2, 2, 9")
    // number of rows in each table
    const tableRowsStats = schema.tables.map((t) => t.stats.rows).join(", ")
    expect(tableRowsStats).toBe("347, 275, 59, 8, 25, 2240, 412, 5, 8715, 18, 3503")

    // no views
    expect(schema.views).toBeUndefined()

    // list of indexes, sorted alphabetically
    const indexesNames = schema.indexes.map((i) => `'${i.name}'`).join(", ")
    expect(indexesNames).toBe(
      "'IFK_AlbumArtistId', 'IFK_CustomerSupportRepId', 'IFK_EmployeeReportsTo', 'IFK_InvoiceCustomerId', 'IFK_InvoiceLineInvoiceId', 'IFK_InvoiceLineTrackId', 'IFK_PlaylistTrackTrackId', 'IFK_TrackAlbumId', 'IFK_TrackGenreId', 'IFK_TrackMediaTypeId', 'sqlite_autoindex_playlist_track_1'"
    )

    // no triggers
    expect(schema.triggers).toBeUndefined()

    // stats info
    expect(schema.stats?.version).toBe("34")
    expect(schema.stats?.size).toBe(884736)
  })

  test("getSchema (test.db)", async () => {
    const connection = await getTestConnection()
    const schemas = await connection.getSchemas(false)
    expect(schemas).toBeTruthy()
    expect(schemas.length).toBe(1)

    const schema = schemas[0]
    expect(schema.database).toBe("main")

    // save schema for verification
    writeJson("./lib/test/artifacts/test.schema.json", schema)

    const tablesNames = schema.tables.map((t) => `'${t.name}'`).join(", ")
    expect(tablesNames).toBe("'albums', 'artists', 'customers', 'employees', 'genres', 'invoice_items', 'invoices', 'media_types', 'playlist_track', 'playlists', 'tracks'")

    const viewsNames = schema.views.map((v) => `'${v.name}'`).join(", ")
    expect(viewsNames).toBe("'CustomerNames', 'DoubleSales', 'InvoiceTotals'")

    const triggersNames = schema.triggers.map((t) => `'${t.name}'`).join(", ")
    expect(triggersNames).toBe("'validate_email_before_insert_customers'")

    // stats info
    expect(schema.stats?.version).toBe("40")
    expect(schema.stats?.size).toBe(886784)
  })

  test("getSchema (sakila.db)", async () => {
    const connection = await getTestConnection("sakila.db")
    const schemas = await connection.getSchemas(false)
    expect(schemas).toBeTruthy()
    expect(schemas.length).toBe(1)

    const schema = schemas[0]
    expect(schema.database).toBe("main")

    // save schema for verification
    writeJson("./lib/test/artifacts/sakila.schema.json", schema)

    const tablesNames = schema.tables.map((t) => `'${t.name}'`).join(", ")
    expect(tablesNames).toBe("'actor', 'address', 'category', 'city', 'country', 'customer', 'film', 'film_actor', 'film_category', 'film_text', 'inventory', 'language', 'payment', 'rental', 'staff', 'store'")

    const viewsNames = schema.views.map((v) => `'${v.name}'`).join(", ")
    expect(viewsNames).toBe("'customer_list', 'film_list', 'sales_by_film_category', 'sales_by_store', 'staff_list'")

    const indexesNames = schema.indexes.map((v) => `'${v.name}'`).join(", ")
    expect(indexesNames).toBe("'idx_actor_last_name', 'idx_customer_fk_address_id', 'idx_customer_fk_store_id', 'idx_customer_last_name', 'idx_fk_city_id', 'idx_fk_country_id', 'idx_fk_customer_id', 'idx_fk_film_actor_actor', 'idx_fk_film_actor_film', 'idx_fk_film_category_category', 'idx_fk_film_category_film', 'idx_fk_film_id', 'idx_fk_film_id_store_id', 'idx_fk_language_id', 'idx_fk_original_language_id', 'idx_fk_staff_address_id', 'idx_fk_staff_id', 'idx_fk_staff_store_id', 'idx_fk_store_address', 'idx_rental_fk_customer_id', 'idx_rental_fk_inventory_id', 'idx_rental_fk_staff_id', 'idx_rental_uq', 'idx_store_fk_manager_staff_id', 'sqlite_autoindex_actor_1', 'sqlite_autoindex_address_1', 'sqlite_autoindex_category_1', 'sqlite_autoindex_city_1', 'sqlite_autoindex_country_1', 'sqlite_autoindex_customer_1', 'sqlite_autoindex_film_1', 'sqlite_autoindex_film_actor_1', 'sqlite_autoindex_film_category_1', 'sqlite_autoindex_film_text_1', 'sqlite_autoindex_inventory_1', 'sqlite_autoindex_language_1', 'sqlite_autoindex_payment_1', 'sqlite_autoindex_rental_1', 'sqlite_autoindex_staff_1', 'sqlite_autoindex_store_1'")

    const triggersNames = schema.triggers.map((t) => `'${t.name}'`).join(", ")
    expect(triggersNames).toBe("'actor_trigger_ai', 'actor_trigger_au', 'address_trigger_ai', 'address_trigger_au', 'category_trigger_ai', 'category_trigger_au', 'city_trigger_ai', 'city_trigger_au', 'country_trigger_ai', 'country_trigger_au', 'customer_trigger_ai', 'customer_trigger_au', 'film_actor_trigger_ai', 'film_actor_trigger_au', 'film_category_trigger_ai', 'film_category_trigger_au', 'film_trigger_ai', 'film_trigger_au', 'inventory_trigger_ai', 'inventory_trigger_au', 'language_trigger_ai', 'language_trigger_au', 'payment_trigger_ai', 'payment_trigger_au', 'rental_trigger_ai', 'rental_trigger_au', 'staff_trigger_ai', 'staff_trigger_au', 'store_trigger_ai', 'store_trigger_au'")

    // stats info
    expect(schema.stats?.version).toBe("75")
    expect(schema.stats?.size).toBe(5828608)
  })

  test("getSchema (blank.db)", async () => {
    const connection = await getBlankConnection()
    const schemas = await connection.getSchemas(false)
    expect(schemas).toBeTruthy()
    expect(schemas.length).toBe(1)
    const schema = schemas[0]

    // save schema for verification
    writeJson("./lib/test/artifacts/blank.schema.json", schema)

    expect(schema.database).toBe("main")
    expect(schema.tables).toBeUndefined()
    expect(schema.views).toBeUndefined()
    expect(schema.indexes).toBeUndefined()
    expect(schema.triggers).toBeUndefined()

    // stats info
    expect(schema.stats?.version).toBe("0")
    expect(schema.stats?.size).toBe(0)
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
      "'Categories', 'CustomerCustomerDemo', 'CustomerDemographics', 'Customers', 'Employees', 'EmployeeTerritories', 'Order Details', 'Orders', 'Products', 'Regions', 'Shippers', 'Suppliers', 'Territories'"
    )
    
    expect(schema.views).toHaveLength(16)
    const viewsNames = schema.views.map((v) => `'${v.name}'`).join(", ")
    expect(viewsNames).toBe(
      "'Alphabetical list of products', 'Category Sales for 1997', 'Current Product List', 'Customer and Suppliers by City', 'Invoices', 'Order Details Extended', 'Order Subtotals', 'Orders Qry', 'Product Sales for 1997', 'Products Above Average Price', 'Products by Category', 'Quarterly Orders', 'Sales by Category', 'Sales Totals by Amount', 'Summary of Sales by Quarter', 'Summary of Sales by Year'"
    )

    // no triggers
    expect(schema.triggers).toBeUndefined()

    // stats info
    expect(schema.stats?.version).toBe("31")
    expect(schema.stats?.size).toBe(561152)
  })

  test("canExport (chinook.db)", async () => {
    const connection = await getChinookConnection()
    expect(connection.canExport()).toBeTruthy()
    expect(connection.canExport(null, "main", "customers")).not.toBeTruthy()
  })

  test("export (chinook.db)", async () => {
    const connection = await getChinookConnection()
    const exportData = await connection.export()

    expect(exportData.data).toBeTruthy()
    expect(exportData.data.length).toBe(884736)
    expect(exportData.type).toBe("application/x-sqlite3")
  })
})
