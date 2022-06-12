//
// utility methods for testing in node environment
//

import fs from "fs"
import { DataConfig } from "../data/connections"
import { DataConnectionFactory } from "../data/factory"
import { SqliteDataConnection } from "../data/clients/sqlite"
import initSqlJs from "sql.js"

export function writeJson(filename, data) {
  const json = JSON.stringify(data, null, "  ")
  fs.writeFileSync(filename, json)
}

export async function getChinookConnection(): Promise<SqliteDataConnection> {
  const engine = await initSqlJs()
  const configs: DataConfig = {
    client: "sqlite3",
    title: "chinook.db",
    connection: {
      file: fs.readFileSync("./lib/test/artifacts/chinook.db"),
    },
  }
  const connection = DataConnectionFactory.create(configs) as SqliteDataConnection
  await connection.connect(engine)
  return connection
}

export async function getTestConnection(): Promise<SqliteDataConnection> {
  const engine = await initSqlJs()
  const configs: DataConfig = {
    client: "sqlite3",
    title: "test.db",
    connection: {
      file: fs.readFileSync("./lib/test/artifacts/test.db"),
    },
  }
  const connection = DataConnectionFactory.create(configs) as SqliteDataConnection
  await connection.connect(engine)
  return connection
}
