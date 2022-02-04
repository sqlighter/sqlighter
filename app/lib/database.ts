//
// database.ts - connectivity and basic operations on standardized Item records
//

import "dotenv/config"

import { assert } from "console"
import { knex, Knex } from "knex"
import { Item } from "./item"

/**
 * Returns a Knex connection to the configured database
 * @param databaseUrl A database url connection, eg. mysql://user:password@server:port/database
 * @see https://knexjs.org/"
 * @see https://devhints.io/knex
 */
export function getDatabase(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) {
    throw new Error("Please configure DATABASE_URL in your .env file, eg: mysql://user:password@server:port/database")
  }

  // TODO could also detect if user passed a json string instead of a connection string and deserialized
  const client = databaseUrl.substring(0, databaseUrl.indexOf(":"))

  return knex({
    client,
    connection: databaseUrl,
    pool: {
      min: 0,
      max: 7,
    },
  })
}

/** Default database connection */
export const database = getDatabase()
export default database

/** Default table for Item like records */
export const ITEMS_TABLE = "items"
export const items = database(ITEMS_TABLE)

//
// Items - functions to store, retrieve, update generic items
//

/** A database utility class used to interrogate tables of generic items */
export class ItemsTable<T extends Item = Item> {
  /** Name of generic items table, normally 'items' */
  readonly tableName: string

  /** Query builder used to interrogate table */
  public get table() {
    return database(this.tableName)
  }

  constructor(tableName = ITEMS_TABLE) {
    this.tableName = tableName
  }

  //
  // table methods
  //

  /** Creates a generic Items table */
  async createTable() {
    if (await this.hasTable()) {
      throw new Error(`createTable - '${this.tableName}' table already exists`)
    }

    await database.schema.createTable(this.tableName, (table) => {
      table.charset("utf8")
      table.string("id", 64).notNullable().primary().index()
      table.string("parentId", 64).nullable().index()
      table.foreign("parentId").references(`${this.tableName}.id`).onUpdate("cascade").onDelete("cascade")
      table.string("type", 32).notNullable().index()
      table.datetime("createdAt", { precision: 3 }).defaultTo(database.fn.now(3))
      table
        .datetime("updatedAt", { precision: 3 })
        .defaultTo(database.raw("CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)"))
      table.json("attributes")
    })
  }

  /** Drops table (if it exists) */
  async dropTable() {
    if (this.hasTable()) {
      await database.schema.dropTable(this.tableName)
    }
  }

  /** Returns true if table already exists */
  async hasTable(): Promise<boolean> {
    return await database.schema.hasTable(this.tableName)
  }

  async resetTable() {
    await this.dropTable()
    await this.createTable()
  }

  //
  // quick accessors
  //

  where(args?) {
    return this.table.where(args)
  }

  select(args?) {
    return this.table.select(args)
  }

  //
  // items methods
  //

  /** Inserts item with a few minor added checks */
  async insertItem(item: Item) {
    try {
      const res = await this.table.insert(item)
      if (res?.length != 1) {
        console.debug(`ItemsTable.insert - ${item} returned ${res}`, res)
      }
      return res
    } catch (exception) {
      console.debug(`ItemsTable.insert - ${item} returned ${exception}`, exception)
      throw exception
    }
  }

  /** Updates all attributes of given item */
  async updateItem(item: Partial<Item>) {
    try {
      assert(item.id && item.attributes)
      return await this.table.update("attributes", JSON.stringify(item.attributes)).where("id", item.id)
    } catch (exception) {
      console.debug(`ItemsTable.update - ${item} returned ${exception}`, exception)
      throw exception
    }
  }
}
