//
// databasetreeview.test.ts
//

import { getChinookConnection, getTestConnection, writeJson } from "../../lib/test/utilities"
import { getTrees } from "./databasetreeview"

describe("databasetreeview.tsx", () => {
  test("getTrees (chinook.db)", async () => {
    const connection = await getChinookConnection()
    const trees = await getTrees(connection, false)
    expect(trees).toBeTruthy()
    expect(trees.length).toBe(1)
    const tree = trees[0]

    // save for verification
    writeJson("./lib/test/artifacts/chinook.tree.json", tree)

    expect(tree.id).toMatch(/\/main/)
    expect(tree.title).toBe("main")
    expect(tree.icon).toBe("database")
    expect(tree.children.length).toBe(4)
    const rootTitles = tree.children.map((c) => c.title).join(", ")
    expect(rootTitles).toBe("Tables, Views, Indexes, Triggers")

    const tables = tree.children[0]
    expect(tables.id).toMatch(/dbc_[a-z0-9]+\/main\/tables/)
    expect(tables.title).toBe("Tables")
    expect(tables.icon).toBe("table")
    expect(tables.badge).toBe("11")
    expect(tables.children.length).toBe(11)
    const tablesTitles = tables.children.map((c) => c.title).join(", ")
    expect(tablesTitles).toBe(
      "albums, artists, customers, employees, genres, invoice_items, invoices, media_types, playlist_track, playlists, tracks"
    )

    const albums = tables.children[0]
    expect(albums.id).toMatch(/dbc_[a-z0-9]+\/main\/tables\/albums/)
    expect(albums.title).toBe("albums")
    expect(albums.icon).toBeUndefined()
    expect(albums.badge).toBeUndefined()
    expect(albums.children.length).toBe(2) // columns, indexes

    const albumsColumns = albums.children[0]
    expect(albumsColumns.id).toMatch(/dbc_[a-z0-9]+\/main\/tables\/albums\/columns/)
    expect(albumsColumns.title).toBe("Columns")
    expect(albumsColumns.icon).toBeUndefined()
    expect(albumsColumns.badge).toBe("3")
    expect(albumsColumns.children.length).toBe(3)
    const albumsColumnsTitles = albumsColumns.children.map((c) => c.title).join(", ")
    expect(albumsColumnsTitles).toBe("AlbumId, Title, ArtistId")

    const albumIdColumn = albumsColumns.children[0]
    expect(albumIdColumn.id).toMatch(/dbc_[a-z0-9]+\/main\/tables\/albums\/columns\/AlbumId/)
    expect(albumIdColumn.title).toBe("AlbumId")
    expect(albumIdColumn.tags[0]).toStrictEqual({ title: "pk", tooltip: "primary key" })
    expect(albumIdColumn.tags[1]).toStrictEqual({ title: "ai", tooltip: "auto increment" })
    expect(albumIdColumn.tags[2]).toStrictEqual({ title: "nn", tooltip: "not nullable" })
    expect(albumIdColumn.tags[3]).toBe("integer")
    expect(albumIdColumn.icon).toBeUndefined()
    expect(albumIdColumn.badge).toBeUndefined()
    expect(albumIdColumn.children).toBeUndefined()

    const titleColumn = albumsColumns.children[1]
    expect(titleColumn.id).toMatch(/dbc_[a-z0-9]+\/main\/tables\/albums\/columns\/Title/)
    expect(titleColumn.title).toBe("Title")
    expect(titleColumn.tags[0]).toStrictEqual({ title: "nn", tooltip: "not nullable" })
    expect(titleColumn.tags[1]).toBe("nvarchar(160)")
    expect(titleColumn.icon).toBeUndefined()
    expect(titleColumn.badge).toBeUndefined()
    expect(titleColumn.children).toBeUndefined()
  })

  test("getTree (test.db)", async () => {
    const connection = await getTestConnection()
    const trees = await getTrees(connection, false)
    expect(trees).toBeTruthy()
    expect(trees.length).toBe(1)
    const tree = trees[0]

    // save for verification
    writeJson("./lib/test/artifacts/test.tree.json", tree)

    const views = tree.children[1]
    expect(views.id).toMatch(/dbc_[a-z0-9]+\/main\/views/)
    expect(views.title).toBe("Views")
    expect(views.icon).toBe("view")
    expect(views.badge).toBe("3")
    expect(views.children.length).toBe(3)
    const viewsTitles = views.children.map((c) => c.title).join(", ")
    expect(viewsTitles).toBe("CustomerNames, DoubleSales, InvoiceTotals")

    const triggers = tree.children[3]
    expect(triggers.id).toMatch(/dbc_[a-z0-9]+\/main\/triggers/)
    expect(triggers.title).toBe("Triggers")
    expect(triggers.icon).toBe("trigger")
    expect(triggers.badge).toBe("1")
    expect(triggers.children.length).toBe(1)
    const triggersTitles = triggers.children.map((c) => c.title).join(", ")
    expect(triggersTitles).toBe("validate_email_before_insert_customers")
  })
})
