//
// fakedata.ts
//

import { DataConnection, DataClient, DataConfig, DataSchema } from "../lib/data/connections"
import { Query, QueryRun } from "../lib/items/query"
import { parseISO } from "date-fns"
import { Command } from "../lib/commands"
import fakeCustomers from "./data/customers"
import { QueryExecResult } from "sql.js"

// DataConnection (fake)
class FakeConnection extends DataConnection {
  public constructor(configs: DataConfig) {
    super(configs)
  }
  public async getSchemas(refresh: boolean = false): Promise<DataSchema[]> {
    return [] // TODO
  }
  public async getResults(sql: string): Promise<QueryExecResult[]> {
    return [fakeCustomers]
  }
  public async getResult(sql: string): Promise<QueryExecResult> {
    return fakeCustomers
  }
  public async getRowsModified(): Promise<number> {
    return 0
  }
}

export const fake_connection1 = new FakeConnection({
  client: "sqlite3",
  title: "chinook.db",
  connection: {},
  metadata: {
    description:
      "Chinook is a sample database available for many database engines. It can be created by running a single SQL script. Chinook database is an alternative to the Northwind database, being ideal for demos and testing ORM tools targeting single and multiple database servers.",
    image: "/databases/chinook.jpg",
    url: "https://github.com/lerocha/chinook-database#:~:text=Chinook%20is%20a%20sample%20database,single%20and%20multiple%20database%20servers.",
  },
})
export const fake_connection2 = new FakeConnection({
  client: "sqlite3",
  title: "CorporateDatabaseWeeklyBackup.db",
  connection: {},
})
export const fake_connection3 = new FakeConnection({
  client: "sqlite3",
  title: "A.db",
  connection: {},
})

// DataConnection[]
export const fake_connections1: DataConnection[] = [fake_connection1, fake_connection2, fake_connection3]

// Query (simple)
export const fake_query1 = new Query()
fake_query1.connectionId = fake_connection1.id
fake_query1.sql = "SELECT\n  *\nFROM\n  customers"
fake_query1.title = "All customers (from 2000)"
fake_query1.createdAt = parseISO("2022-06-02 07:02:15")

// QueryRun (completed)
export const fake_queryCompletedSmall = new QueryRun()
fake_queryCompletedSmall.query = fake_query1
fake_queryCompletedSmall.sql = fake_query1.sql
fake_queryCompletedSmall.status = "completed"
fake_queryCompletedSmall.createdAt = parseISO("2022-06-02 13:02:15")
fake_queryCompletedSmall.updatedAt = parseISO("2022-06-02 13:02:18.141592")
fake_queryCompletedSmall.columns = ["FirstName", "LastName"]
fake_queryCompletedSmall.values = [
  ["John", "Jane"],
  ["Smith", "Doe"],
]

// QueryRun (completed, large dataset)
export const fake_queryCompletedLarge = new QueryRun()
fake_queryCompletedLarge.query = fake_query1
fake_queryCompletedLarge.sql = fakeCustomers.sql
fake_queryCompletedLarge.status = "completed"
fake_queryCompletedLarge.createdAt = parseISO("2022-06-02 13:02:15")
fake_queryCompletedLarge.updatedAt = parseISO("2022-06-02 13:02:18.141592")
fake_queryCompletedLarge.columns = fakeCustomers.columns
fake_queryCompletedLarge.values = fakeCustomers.values

// QueryRun (completed)
export const fake_queryRunning1 = new QueryRun()
fake_queryRunning1.query = fake_query1
fake_queryRunning1.sql = fake_query1.sql
fake_queryRunning1.status = "running"
fake_queryRunning1.createdAt = new Date()

// QueryRun (error)
export const fake_queryError1 = new QueryRun()
fake_queryError1.query = fake_query1
fake_queryError1.sql = fake_query1.sql
fake_queryError1.status = "error"
fake_queryError1.error = 'error: Error: near "FROM1": syntax error'

// Various commands with labels and icons
export const databaseCommand: Command = {
  command: "openDatabase",
  title: "Database",
  description: "Open a database",
  icon: "database",
}
export const queryCommand: Command = {
  command: "openQuery",
  title: "Data",
  description: "Run SQL queries",
  icon: "table",
}
export const printCommand: Command = {
  command: "print",
  title: "Print",
  description: "Print this document",
  icon: "print",
}

export const sqlCmd: Command = { command: "viewSql", title: "SQL", icon: "code" }
export const dataCmd: Command = { command: "viewData", title: "Data", icon: "table" }
export const chartCommand: Command = { command: "viewChart", title: "Charts", icon: "chart" }
export const addonCmd: Command = { command: "viewAddon", title: "More", icon: "extension" }
export const settingsCmd: Command = {
  command: "openSettings",
  title: "Settings",
  description: "Open settings and configurations",
  icon: "settings",
}
