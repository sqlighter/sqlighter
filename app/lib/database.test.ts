//
// database.test.ts
//

import "dotenv/config"
import assert from "assert/strict"
import { Item } from "./items"
import { database, ItemsTable } from "./database"
export const TEST_ITEMS_TABLE = "test_items"

async function getTestTable() {
  const itemsTable = new ItemsTable(TEST_ITEMS_TABLE)
  await itemsTable.resetTable()
  return itemsTable
}

describe("database.ts", () => {
  test("isConfigured", () => {
    const databaseUrl = process.env.DATABASE_URL
    expect(databaseUrl).toBeTruthy()
  })

  test("canConnect", async () => {
    const r1 = await database.raw("select 'test' as 'name'")
    expect(r1[0][0].name).toBe("test")
  })

  /** Initialize actual 'items' schema if missing (database is new) */
  test("initializeTable (items)", async () => {
    const itemsTable = new ItemsTable()
    const exists = await itemsTable.hasTable()
    if (!exists) {
      await itemsTable.createTable()
    }
  })

  test("initializeTable (test_items)", async () => {
    const itemsTable = await getTestTable()
  })

  test("insert with unicode", async () => {
    const itemsTable = await getTestTable()

    // insert item with unicode chars
    const t1 = await itemsTable.insertItem({
      id: "usr_香蕉",
      type: "user",
      attributes: {
        name: "one",
        banana: "香蕉",
      },
    })

    const items1 = await itemsTable.select().where("id", "usr_香蕉")
    expect(items1).toHaveLength(1)
    expect(items1[0].id).toBe("usr_香蕉")
    expect(items1[0].attributes.banana).toBe("香蕉")
  })

  test("insert with children", async () => {
    const itemsTable = await getTestTable()

    // insert items
    const u1 = await itemsTable.insertItem({ id: "usr_1", type: "user" })
    const u2 = await itemsTable.insertItem({ id: "usr_2", type: "user" })

    // insert children
    const c1 = await itemsTable.insertItem({ id: "usr_10", parentId: "usr_1", type: "user" })
    const c2 = await itemsTable.insertItem({ id: "usr_20", parentId: "usr_2", type: "user" })

    const items1 = await itemsTable.select().where("type", "user")
    expect(items1).toHaveLength(4)
  })

  test("insert with invalid parent", async () => {
    const itemsTable = await getTestTable()

    // insert item
    const u1 = await itemsTable.insertItem({ id: "usr_1", type: "user" })

    // insert invalid parentId
    let hasThrown = false
    try {
      const c1 = await itemsTable.insertItem({ id: "usr_10", parentId: "usr_invalid", type: "user" })
    } catch {
      hasThrown = true
    }
    expect(hasThrown).toBeTruthy()
  })

  test("update attributes", async () => {
    const itemsTable = await getTestTable()

    // insert item
    await itemsTable.insertItem({ id: "usr_1", type: "user", attributes: { name: "Jim", age: 30 } })

    // insert child
    await itemsTable.insertItem({
      id: "usr_2",
      parentId: "usr_1",
      type: "relative",
      attributes: { name: "Jane", age: 7, toy: "Potato head" },
    })
    const cBefore = (await itemsTable.select().where("id", "usr_2"))[0]
    expect(cBefore.id).toBe("usr_2")
    expect(cBefore.parentId).toBe("usr_1")
    expect(cBefore.attributes.name).toBe("Jane")
    expect(cBefore.attributes.age).toBe(7)
    expect(cBefore.attributes.toy).toBe("Potato head")

    // update child data
    await itemsTable.updateItem({
      id: "usr_2",
      attributes: { name: "Jane", age: 8 },
    })
    const cAfter = (await itemsTable.select().where("id", "usr_2"))[0]
    expect(cAfter.id).toBe("usr_2")
    expect(cAfter.parentId).toBe("usr_1")
    expect(cAfter.attributes.name).toBe("Jane")
    expect(cAfter.attributes.age).toBe(8) // existing fields updated
    expect(cAfter.attributes.toy).toBeUndefined() // missing fields removed
    expect(cAfter.parentId).toBe(cBefore.parentId)
    expect(cAfter.createdAt).toStrictEqual(cBefore.createdAt)
    expect(cAfter.updatedAt > cBefore.updatedAt).toBeTruthy() // updatedAt changed

    // other items not changed
    const u1 = (await itemsTable.select().where("id", "usr_1"))[0]
    expect(u1.id).toBe("usr_1")
    expect(u1.attributes.name).toBe("Jim")
    expect(u1.attributes.age).toBe(30)
  })
})
