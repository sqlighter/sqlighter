//
// connections.ts - base class for data connections that can provide data, schemas, etc.
//

import { QueryExecResult } from "sql.js"

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

export interface DataConnectionConfigParams {
  // TDB...
  host?: string
  port?: number
  user?: string
  password?: string
  database?: string
  filename?: string

  /** Binary buffer containing the actual database data, eg. sqlite3 */
  buffer?: Buffer
}

/**
 * Configuration used to connect with data source
 * @see http://knexjs.org/#Installation-client
 */
export interface DataConnectionConfigs {
  /** Type of client that should be used to connect */
  client: "sqlite3" | "mysql" // etc...

  /** Connection string or object with detailed connection parameters */
  connection: string | DataConnectionConfigParams
}

export abstract class DataConnection {
  /** Active data connections */
  protected static _connections: DataConnection[] = []

  /** Configurations used to open this data connection */
  protected _configs: DataConnectionConfigs

  /** Concrete classes only */
  protected constructor(configs: DataConnectionConfigs) {
    this._configs = configs
  }

  //
  // connections
  //

  /** Returns currently opened connections */
  public static getConnections(): DataConnection[] {
    return DataConnection._connections
  }

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
}
