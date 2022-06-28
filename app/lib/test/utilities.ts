//
// utility methods for testing in node environment
//

import fs from "fs"
import { DataConfig } from "../data/connections"
import { DataConnectionFactory } from "../data/factory"
import { SqliteDataConnection } from "../data/clients/sqlite"
import initSqlJs from "sql.js"

export function writeJson(filename, data) {
  // do not serialize connections
  function replacer(this: any, key: string, value: any) {
    if (key == "connection" && value?.id) {
      return value.id
    }
    return value
  }

  const json = JSON.stringify(data, replacer, "  ")
  fs.writeFileSync(filename, json)
}

export async function getTestConnection(databaseName = "test.db"): Promise<SqliteDataConnection> {
  const engine = await initSqlJs()
  const configs: DataConfig = {
    id: `dbc_${databaseName.replace(".", "")}`,
    client: "sqlite3",
    title: databaseName,
    connection: {
      file: fs.readFileSync(`./lib/test/artifacts/${databaseName}`),
    },
  }
  const connection = DataConnectionFactory.create(configs) as SqliteDataConnection
  await connection.connect(engine)
  return connection
}

export async function getChinookConnection(): Promise<SqliteDataConnection> {
  return getTestConnection("chinook.db")
}

export async function getNorthwindConnection(): Promise<SqliteDataConnection> {
  return getTestConnection("northwind.db")
}

/** Returns a blank in memory database */
export async function getBlankConnection(): Promise<SqliteDataConnection> {
  const engine = await initSqlJs()
  const configs: DataConfig = {
    client: "sqlite3",
    title: "Blank.db",
    connection: {
      filename: ":memory:",
    },
  }
  const connection = DataConnectionFactory.create(configs) as SqliteDataConnection
  await connection.connect(engine)
  return connection
}
