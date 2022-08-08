//
// database.test.ts
//

import "dotenv/config"
import { getDatabase, ItemsTable, unpackItem } from "./database"

describe("database.ts", () => {
  // table used to test database
  let itemsTable = null
  jest.setTimeout(60 * 1000)
  
  // start each test with an empty table
  beforeEach(async () => {
    itemsTable = new ItemsTable()
    await itemsTable.resetTable()
  })

  test("isConfigured", () => {
    const databaseUrl = process.env.DATABASE_URL
    expect(databaseUrl).toBeTruthy()
  })

  /** Check if we can connect to the production database DATABASE_URL */
  test("canConnect", async () => {
    const databaseUrl = process.env.DATABASE_URL
    const database = getDatabase(databaseUrl)
    const r1 = await database.raw("select 'test' as 'name'")
    expect(r1[0][0].name).toBe("test")
  })

  /** Initialize actual 'items' schema if missing (database is new) */
  test("initializeTable (items)", async () => {
    const exists = await itemsTable.hasTable()
    if (!exists) {
      await itemsTable.createTable()
    }
  })

  test("insert with unicode", async () => {
    // insert item with unicode chars
    await itemsTable.insertItem({
      id: "usr_香蕉",
      type: "user",
      name: "one",
      banana: "香蕉",
    })

    let items1 = await itemsTable.select().where("id", "usr_香蕉")
    // plain results need to "unpack" attributes to regular fields
    items1 = items1.map((item) => unpackItem(item))
    expect(items1).toHaveLength(1)
    expect(items1[0].id).toBe("usr_香蕉")
    expect(items1[0].banana).toBe("香蕉")
  })

  test("insert with children", async () => {
    // insert items
    await itemsTable.insertItem({ id: "usr_1", type: "user" })
    await itemsTable.insertItem({ id: "usr_2", type: "user" })

    // insert children
    await itemsTable.insertItem({ id: "usr_10", parentId: "usr_1", type: "user" })
    await itemsTable.insertItem({ id: "usr_20", parentId: "usr_2", type: "user" })

    const items1 = await itemsTable.select().where("type", "user")
    expect(items1).toHaveLength(4)
  })

  test("insertItem with invalid parent", async () => {
    // insert item
    await itemsTable.insertItem({ id: "usr_1", type: "user" })

    // insert invalid parentId
    let hasThrown = false
    try {
      await itemsTable.insertItem({ id: "usr_10", parentId: "usr_invalid", type: "user" })
    } catch {
      hasThrown = true
    }
    expect(hasThrown).toBeTruthy()
  })

  test("selectItem", async () => {
    await itemsTable.insertItem({ id: "usr_1", type: "user", profile: { displayName: "Jim", birthdate: "1990-05-20" } })

    const item = await itemsTable.selectItem("usr_1")
    expect(item).toBeTruthy()
    expect(item.id).toBe("usr_1")
    expect(item.parentId).toBeNull()
    expect(item.profile.displayName).toBe("Jim")
    expect(item.profile.birthdate).toBe("1990-05-20")
  })

  test("selectItem with invalid itemId", async () => {
    await itemsTable.insertItem({ id: "usr_1", type: "user", profile: { displayName: "Jim", birthdate: "1990-05-20" } })
    const item = await itemsTable.selectItem("usr_2")
    expect(item).toBeNull()
  })

  test("updateItem attributes", async () => {
    // insert item
    await itemsTable.insertItem({ id: "usr_1", type: "user", profile: { displayName: "Jim", birthdate: "1990-05-20" } })

    // insert child
    await itemsTable.insertItem({
      id: "usr_2",
      parentId: "usr_1",
      type: "relative",
      profile: { displayName: "Jane", age: 7 },
      toy: "Potato head",
    })
    const cBefore = await itemsTable.selectItem("usr_2")
    expect(cBefore.id).toBe("usr_2")
    expect(cBefore.parentId).toBe("usr_1")
    expect(cBefore.profile.displayName).toBe("Jane")
    expect(cBefore.profile.age).toBe(7)
    expect(cBefore.toy).toBe("Potato head")

    // update child data
    await itemsTable.updateItem({
      id: "usr_2",
      profile: { displayName: "Jane", age: 8 },
    })
    const cAfter = await itemsTable.selectItem("usr_2")
    expect(cAfter.id).toBe("usr_2")
    expect(cAfter.parentId).toBe("usr_1")
    expect(cAfter.profile.displayName).toBe("Jane")
    expect(cAfter.profile.age).toBe(8) // existing fields updated
    expect(cAfter.toy).toBeUndefined() // missing fields removed
    expect(cAfter.parentId).toBe(cBefore.parentId)
    expect(cAfter.createdAt).toStrictEqual(cBefore.createdAt)
    expect(cAfter.updatedAt > cBefore.updatedAt).toBeTruthy() // updatedAt changed

    // other items not changed
    const u1 = await itemsTable.selectItem("usr_1")
    expect(u1.id).toBe("usr_1")
    expect(u1.profile.displayName).toBe("Jim")
    expect(u1.profile.birthdate).toBe("1990-05-20")
  })
})
