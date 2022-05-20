//
// connections.ts - base class for data connections that can provide data, schemas, etc.
//

import { QueryExecResult } from "sql.js"

export interface DataSchema {
  /** Type of entity */
  type: "table" | "index" | "trigger" | "view"

  /** Name of the entity */
  name: string

  /** SQL create statement for this entity */
  sql: string

  /** Abstract syntax tree (AST) for this entity */
  ast: {
    [key: string]: string | boolean | [] | {}
  }
}

interface DataConnectionConfigParams {
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
  connection: DataConnectionConfigParams | string;
}

export abstract class DataConnection {
  /** Configurations used to open this data connection */
  protected _configs: DataConnectionConfigs

  /** Active data connections */
  protected static _connections: DataConnection[] = []

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
  public abstract getSchema(refresh: boolean): Promise<DataSchema[]>

  //
  // data
  //

  /** Run a SQL query and return zero o more results from it */
  public abstract getResults(sql: string): Promise<QueryExecResult[]>

  /** Run a SQL query that generates a single result set */
  public abstract getResult(sql: string): Promise<QueryExecResult>
}
