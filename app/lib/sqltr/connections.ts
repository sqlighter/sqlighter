//
// connections.ts - base class for data connections that can provide data, schemas, etc.
//

import { QueryExecResult } from "sql.js"
import { generateId } from "../../lib/items/items"


/** Client used to connect to a database, @see http://knexjs.org/guide/#node-js */
export type ConnectionClient = "sqlite3" | "mysql" | "pg" | "oracledb" | "tedius" | string

/**
 * Configuration used to connect with data source
 * @see http://knexjs.org/guide/#configuration-options
 */
export interface ConnectionConfigs {
  // TDB...
  host?: string
  port?: number
  user?: string
  password?: string

  /** Name of the connected database, eg. main */
  database?: string

  filename?: string

  url?: string

  /** Binary buffer containing the actual database data, eg. sqlite3 */
  buffer?: Buffer

  /**
   * A file containing the database data
   * @see https://developer.mozilla.org/en-US/docs/Web/API/File
   */
  file?: File
}

/** Database schema */
export interface DataSchema {
  /** Name of database for this schema */
  database?: string

  /** Tables in the schema */
  tables?: {
    name: string
    sql: string
    columns: {
      name: string
      datatype: string
      constraints?: string[]
    }[]
    indexes: {
      name: string
      sql: string
      columns: string[]
    }[]
    foreignKeys: {
      columns: string[]
      references: {
        table: string
        columns: string[]
        onUpdate: "no action" | "restrict" | "set null" | "set default" | "cascade"
        onDelete: "no action" | "restrict" | "set null" | "set default" | "cascade"
      }[]
    }[]
  }[]

  /** Triggers in the schema */
  triggers?: {
    name: string
    sql: string
    on?: string
  }[]

  /** Views in the schema */
  views?: {
    name: string
    sql: string
    from?: string
  }[]
}

/** An abstract class for a data connection capable of retrieving, modifying data and schemas */
export abstract class DataConnection {
  /** Client used to connect with database */
  readonly client: ConnectionClient

  /** Persistent unique identifier for this connection  */
  readonly id: string

  /** Configuration used to open this data connection */
  readonly configs: ConnectionConfigs

  /** User defined title for the connection */
  title?: string

  /** Concrete classes only */
  protected constructor(client: ConnectionClient, configs: string | ConnectionConfigs) {
    this.client = client
    this.id = generateId("dbc_")
    this.configs = parseConnectionConfigs(configs)

    // use filename as connection's title if provided
    this.title = this.configs?.filename || this.id
  }

  //
  // static
  //

  /** Active data connections */
  protected static _connections: DataConnection[] = []

  /** Returns currently opened connections */
  public static getConnections(): DataConnection[] {
    return DataConnection._connections
  }

  //
  // connections
  //

  // TODO onConnectionsChange event emitter
  // https://stackoverflow.com/questions/39142858/declaring-events-in-a-typescript-class-which-extends-eventemitter

  //
  // schema
  //

  /** Returns schema for this data source */
  public abstract getSchemas(refresh: boolean): Promise<DataSchema[]>

  //
  // data
  //

  /** Run a SQL query and return zero o more results from it */
  public abstract getResults(sql: string): Promise<QueryExecResult[]>

  /** Run a SQL query that generates a single result set */
  public abstract getResult(sql: string): Promise<QueryExecResult>

  /**
   * Returns the number of changed rows (modified, inserted or deleted) by the latest
   * completed INSERT, UPDATE or DELETE statement on the database. Executing any other
   * type of SQL statement does not modify the value returned by this function.
   */
  public abstract getRowsModified(): Promise<number>
}

/** Parse connection string into an object or prepare/expand connection configurations */
function parseConnectionConfigs(connection: string | ConnectionConfigs): ConnectionConfigs {
  if (typeof connection === "string") {
    return {
      // TODO parse url into parts
      url: connection,
    }
  }
  return connection
}
