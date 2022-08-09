//
// fakedata.ts
//

import Box from "@mui/material/Box"

import { DataConnection, DataConfig, DataSchema, CONNECTION_PREFIX } from "../../lib/data/connections"
import { Query, QueryRun } from "../../lib/items/query"
import { add, set } from "date-fns"
import { Command } from "../../lib/commands"
import fakeCustomers from "./customers"
import { QueryExecResult } from "sql.js"
import { DataConnectionFactory } from "../../lib/data/factory"
import { SqliteDataConnection } from "../../lib/data/clients/sqlite"
import { BOOKMARKS_FOLDER } from "../../components/activities/bookmarksactivity"
import { Panel } from "../../components/navigation/panel"
import { User } from "../../lib/items/users"

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
  public async getRowsModified(): Promise<number> {
    return 0
  }
}

export const fake_connection1 = new FakeConnection({
  client: "sqlite3",
  title: "fakenook.db",
  connection: {},
  metadata: {
    description:
      "Chinook is a sample database available for many database engines. It can be created by running a single SQL script. Chinook database is an alternative to the Northwind database, being ideal for demos and testing ORM tools targeting single and multiple database servers.",
    image: "/databases/chinook.jpeg",
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

/** This is an empty database */
export const fake_emptyDatabase = new FakeConnection({
  client: "sqlite3",
  title: "fakenook.db",
  connection: {},
  metadata: {
    description:
      "Chinook is a sample database available for many database engines. It can be created by running a single SQL script. Chinook database is an alternative to the Northwind database, being ideal for demos and testing ORM tools targeting single and multiple database servers.",
    image: "/databases/chinook.jpeg",
    url: "https://github.com/lerocha/chinook-database#:~:text=Chinook%20is%20a%20sample%20database,single%20and%20multiple%20database%20servers.",
  },
})

// DataConnection[]
export const fake_connections1: DataConnection[] = [fake_connection1, fake_connection2, fake_connection3]

// Query (simple)
export const fake_query1 = new Query()
fake_query1.connectionId = fake_connection1.id
fake_query1.sql = "SELECT\n  *\nFROM\n  customers"
fake_query1.title = "All customers (from 2000)"
fake_query1.createdAt = "2022-06-02 07:02:15"

// QueryRun (completed)
export const fake_queryCompletedSmall = new QueryRun()
fake_queryCompletedSmall.query = fake_query1
fake_queryCompletedSmall.sql = fake_query1.sql
fake_queryCompletedSmall.status = "completed"
fake_queryCompletedSmall.createdAt = "2022-06-02 13:02:15"
fake_queryCompletedSmall.updatedAt = "2022-06-02 13:02:18.141592"
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
fake_queryCompletedLarge.createdAt = "2022-06-02 13:02:15"
fake_queryCompletedLarge.updatedAt = "2022-06-02 13:02:18.141592"
fake_queryCompletedLarge.columns = fakeCustomers.columns
fake_queryCompletedLarge.values = fakeCustomers.values

// QueryRun (completed)
export const fake_queryRunning1 = new QueryRun()
fake_queryRunning1.query = fake_query1
fake_queryRunning1.sql = fake_query1.sql
fake_queryRunning1.status = "running"
fake_queryRunning1.createdAt = new Date().toISOString()

// QueryRun (error)
export const fake_queryError1 = new QueryRun()
fake_queryError1.query = fake_query1
fake_queryError1.sql = fake_query1.sql
fake_queryError1.status = "error"
fake_queryError1.error = 'error: Error: near "FROM1": syntax error'

// Various commands with labels and icons
export const databaseCmd: Command = {
  command: "openDatabase",
  title: "Database",
  description: "Open a database",
  icon: "database",
}
export const queryCmd: Command = {
  command: "openQuery",
  title: "Data",
  description: "Run SQL queries",
  icon: "table",
}
export const printCmd: Command = {
  command: "print",
  title: "Print",
  description: "Print this document",
  icon: "print",
}

export const sqlCmd: Command = { command: "viewSql", title: "SQL", icon: "query" }
export const dataCmd: Command = { command: "viewData", title: "Data", icon: "table" }
export const chartCmd: Command = { command: "viewChart", title: "Charts", icon: "chart" }
export const addonCmd: Command = { command: "viewAddon", title: "More", icon: "extension" }
export const settingsCmd: Command = {
  command: "openSettings",
  title: "Settings",
  description: "Open settings and configurations",
  icon: "settings",
}

// fake user with google passport login
export const fake_user_mickey = User.fromObject({
  id: "mickey.mouse@gmail.com",
  parentId: null,
  type: "user",
  createdAt: new Date("2022-05-09T10:52:45.486Z"),
  updatedAt: new Date("2022-05-26T14:59:30.403Z"),
  passport: {
    id: "105223593685623481361",
    name: {
      givenName: "Mickey",
      familyName: "Mouse",
    },
    emails: [
      {
        value: "mickey.mouse@gmail.com",
      },
    ],
    photos: [
      {
        value: "/test/mickey.jpeg",
      },
    ],
    provider: "google-one-tap",
    displayName: "Mickey Mouse",
  },
  profile: {
    gender: "cartoon",
    height: 69,
    weight: 10,
    birthdate: "1901-12-01",
  },
}, User)

// fake user with very long name and google passport login
export const fake_user_longname = User.fromObject({
  id: "cayetana.fitzjamesstuartduchessadalba@gmail.com",
  parentId: null,
  type: "user",
  createdAt: "2022-05-09T10:52:45.486Z",
  updatedAt: "2022-05-26T14:59:30.403Z",
  passport: {
    id: "105223593685623481361",
    name: {
      givenName: "Cayetana",
      familyName: "Fitz-James Stuart Duchessa d'Alba",
    },
    emails: [
      {
        value: "cayetana.fitzjamesstuartduchessadalba@gmail.com",
      },
    ],
    photos: [
      {
        value: "/test/duchess.jpeg",
      },
    ],
    provider: "google-one-tap",
    displayName: "Cayetana Fitz-James Stuart Duchessa d'Alba",
  },
  profile: {
    gender: "female",
    birthdate: "1926-03-28",
  },
}, User)

//
// actual chinook.db database loaded on the spot from the network
//

const initSqlJs = (window as any).initSqlJs

export async function getTestConnection(
  database = "Test.db"
): Promise<{ connection: SqliteDataConnection; schemas: DataSchema[] }> {
  console.assert(database.endsWith(".db"))
  const engine = await initSqlJs({
    locateFile: (file) => `/${file}`,
  })
  const configs: DataConfig = {
    id: CONNECTION_PREFIX + database.toLocaleLowerCase().substring(0, database.length - 3),
    client: "sqlite3",
    title: database,
    connection: {
      url: `https://sqlighter.com/databases/${database.toLowerCase()}`,
    },
  }
  const connection = DataConnectionFactory.create(configs) as SqliteDataConnection
  await connection.connect(engine)
  const schemas = await connection.getSchemas()
  return { connection, schemas }
}

/** This is a connection to an empty, but real, in memory sqlite3 database */
export async function getBlankConnection(): Promise<{ connection: SqliteDataConnection; schemas: DataSchema[] }> {
  const engine = await initSqlJs({
    locateFile: (file) => `/${file}`,
  })
  const configs: DataConfig = {
    id: "dbc_empty",
    client: "sqlite3",
    title: "Blank.db",
    connection: {
      filename: ":memory:",
    },
  }
  const connection = DataConnectionFactory.create(configs) as SqliteDataConnection
  await connection.connect(engine)
  const schemas = await connection.getSchemas()
  return { connection, schemas }
}

//
// query history
//

export const fake_today = set(new Date(), { hours: 16, minutes: 30, seconds: 0, milliseconds: 0 })
export const fake_tables = [
  "Orders",
  "customers",
  "Product Qlty",
  "invoices",
  "localAddresses",
  "support_tickets",
  "sales",
]
export const fake_history: Query[] = []
for (let i = 0; i < 100; i++) {
  fake_history.push({
    id: `sql_8ocd5ku1rk16c5ksb${i % 8}`,
    title: `Query ${i} with a ${["slightly", "quite", "really"][i % 3]} long title that overflows`,
    connection: fake_connection1,
    database: "main",
    sql: `select\n  *\nfrom\n  ${fake_tables[i % fake_tables.length]}`,
    createdAt: add(fake_today, { hours: -1 * i }).toISOString(),
    updatedAt: add(fake_today, { hours: -1 * i }).toISOString(),
  })
}

// fake queries in bookmark folders
export const fake_folders = [BOOKMARKS_FOLDER, "Joins, etc.", "Folder 2", "Shared Queries"]
export const fake_bookmarks = fake_history.map((q, index) => {
  return { ...q, folder: fake_folders[index % fake_folders.length] }
})

// a single, very fake, query/bookmark
export const fake_bookmark: Query = {
  id: `sql_xxxx`,
  title: `A custom query with a really long title that overflows`,
  connection: fake_connection1,
  database: "main",
  folder: BOOKMARKS_FOLDER,
  sql: `select\n  *\nfrom\n CustomersOrders`,
  createdAt: fake_today.toISOString(),
  updatedAt: fake_today.toISOString(),
}

export const fake_activities = [
  <Panel id="act_database" title="Database" icon="database">
    <Box sx={{ padding: 1 }}>Database activity</Box>
  </Panel>,
  <Panel id="act_bookmarks" title="Bookmarks" icon="bookmark">
    <Box sx={{ padding: 1 }}>Bookmarks activity</Box>
  </Panel>,
  <Panel id="act_history" title="History" icon="history">
    <Box sx={{ padding: 1 }}>History activity</Box>
  </Panel>,
]
