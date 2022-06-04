//
// fakedata.ts
//

import { DataConnection } from "../lib/sqltr/connections"
import { Query, QueryRun } from "../lib/items/query"
import { parseISO } from "date-fns"
import { Command } from "../lib/commands"
import fakeCustomers from "./data/customers"

//import { readJson } from "../lib/utilities"

// DataConnection (fake)
export const fake_connection1 = {
  id: "dbc_fake01",
  title: "chinook.db",
  configs: {
    client: "sqlite3",
  },
} as DataConnection

// DataConnection[]
export const connections1: DataConnection[] = [fake_connection1]

// Query (simple)
export const fake_query1 = new Query()
fake_query1.connectionId = fake_connection1.id
fake_query1.sql = "SELECT\n  *\nFROM\n  customers"
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
  command: "showSql",
  title: "SQL",
  icon: "database",
}
export const queryCommand: Command = {
  command: "openQuery",
  title: "Data",
  icon: "table",
}
export const chartsCommand: Command = {
  command: "openCharts",
  title: "Charts",
  icon: "chart",
}
export const printCommand: Command = {
  command: "print",
  title: "Print",
  icon: "print",
}
