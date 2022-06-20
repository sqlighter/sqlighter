//
// connections.ts - base class for data connections that can provide data, schemas, etc.
//

import { QueryExecResult } from "sql.js"
import { generateId } from "../shared"

export const CONNECTION_TYPE = "connection"
export const CONNECTION_PREFIX = "dbc_"

/** Client used to connect to a database, @see http://knexjs.org/guide/#node-js */
export type DataClient = "sqlite3" | "mysql" | "pg" | "oracledb" | "tedius" | string

/**
 * Configuration used to connect with data source
 * @see http://knexjs.org/guide/#configuration-options
 */
export interface DataConfig {
  /** Persistent unique identifier for this connection, eg: dbc_xxx */
  id?: string
  /** Client driver that should be used to connect */
  client: DataClient
  /** User defined title for the connection */
  title?: string

  /** Connection's configurations */
  connection: {
    /** Hostname */
    host?: string
    /** Port to connect to, eg. 3306 */
    port?: number
    /** Database user, eg. 'root' */
    user?: string
    /** User's password */
    password?: string
    /** Name of the connected database, eg. 'main' */
    database?: string
    /** Url from which host, port, user, password, etc can be parsed for connection or actual data url in case of SQLite */
    url?: string
    /** Name of file (or in memory database) to be opened for SQLite */
    filename?: string | ":memory:"
    /**
     * SQLite databases can be opened directly from a Buffer containing
     * the data itself. On the client side, you can also provide a File
     * or FileSystemFileHandle passed by file picker or drag and drop.
     * These two classes are not implemented in node.js and are ignored.
     */
    file?: Buffer | any // File | FileSystemFileHandle
  }

  /** Additional metadata for this connection (optional) */
  metadata?: {
    /** A description of this data connection */
    description?: string
    /** An image used to represent this database */
    image?: string
    /** Link to additional information regarding this database */
    url?: string
    /** More keys (open ended) */
    [key: string]: string | number
  }
}

/** Schema information for a table or view */
export interface DataTableSchema {
  name: string
  sql: string
  columns: {
    name: string
    datatype: string
    defaultValue?: string | number
    primaryKey?: boolean
    autoIncrement?: boolean
    notNull?: boolean
    tags?: string[]
  }[]
  /** Table's foreign keys (if any) */
  foreignKeys?: {
    table: string
    fromColumn: string
    toColumn: string
    onUpdate: "no action" | "restrict" | "set null" | "set default" | "cascade"
    onDelete: "no action" | "restrict" | "set null" | "set default" | "cascade"
  }[]
  stats?: {
    /** Number of rows in this table */
    rows?: number
  }
}

/** Database schema */
export interface DataSchema {
  /** Name of database for this schema, eg: 'main' */
  database?: string

  /** Tables in the schema */
  tables?: DataTableSchema[]

  /** Views in the schema */
  views?: DataTableSchema[]

  /** Indexes in the schema */
  indexes: {
    name: string
    sql?: string
    table: string
    columns?: string[]
  }[]

  /** Triggers in the schema */
  triggers?: {
    name: string
    sql: string
    table: string
  }[]

  /** Database level statistics */
  stats?: {
    /** Schema version (where supported) */
    version?: string
    /** Database size in bytes */
    size?: number
  }
}

// generic data connection client constructor
type Constructor<T extends DataConnection = DataConnection> = new (args: DataConfig) => T

/**
 * An abstract class for a data connection capable of retrieving,
 * modifying data and schemas. Concrete clients implement the actual
 * connection logic which is database specific and may require
 * additional libraries.
 */
export abstract class DataConnection {
  /** Unique identifier for this connection */
  public get id(): string {
    return this._configs?.id
  }

  /** User readable title for this connection */
  public get title(): string {
    return this._configs?.title
  }

  /** Configuration used to open this data connection */
  protected _configs: DataConfig
  public get configs() {
    return this._configs
  }

  /** Concrete classes only */
  protected constructor(configs: DataConfig) {
    configs = { ...configs }
    const connection = configs.connection

    if (!configs.id) {
      configs.id = generateId("dbc_")
    }

    // detect filename if available
    if (connection.file && !connection.filename) {
      try {
        if (connection.file instanceof File) {
          connection.filename = connection.file.name
        }
        if (connection.file instanceof FileSystemFileHandle) {
          connection.filename = connection.file.name
        }
      } catch (error) {
        // File and FileSystemFileHandle do not exist when running on the server
        // silence this issue so we can share code between client and server side
        if (!(error instanceof ReferenceError)) {
          throw error
        }
      }
    }

    if (connection.url) {
      // TODO parse url into parts
    }

    if (!configs.title) {
      configs.title = configs.id
      if (configs.connection.filename && configs.connection.filename !== ":memory:") {
        configs.title = configs.connection.filename
      }
    }

    this._configs = configs
  }

  //
  // connections
  //

  /** Returns true if this connection is currently connected */
  public get isConnected(): boolean {
    // subclasses implement connection check logic if needed
    return true
  }

  // TODO onConnectionChange event emitter
  // https://stackoverflow.com/questions/39142858/declaring-events-in-a-typescript-class-which-extends-eventemitter

  /** Connect this connection to remote server or load data from files, etc */
  public async connect(...args): Promise<void> {
    // subclasses implement further connection logic if needed
  }

  /** Disconnect this connection from remote server, release data from memory, etc */
  public async disconnect(): Promise<void> {
    // subclasses implement connection logic if needed
  }

  //
  // schema
  //

  /** Returns schema for this data source */
  public abstract getSchemas(refresh: boolean): Promise<DataSchema[]>

  //
  // query
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

  //
  // export
  //

  /** True if data connection can export data for the given database, table and format */
  public canExport(database?: string, table?: string, format?: string): boolean {
    return false
  }

  /**
   * Exports data in the given format
   * @param database Which specific database to export? Default null for entire database
   * @param table Specific table to be exported, default null for all contents
   * @param format Specific format to export in, default null for native format
   * @returns Exported data as byte array and data mime type
   */
  public async export(database?: string, table?: string, format?: string): Promise<{ data: Uint8Array; type: string }> {
    return null
  }
}

//
// exceptions
//

export interface DataErrorOptions extends ErrorOptions {
  connection?: DataConnection
  configs?: DataConfig
  sql?: string
}

/** An error resulting from an operation on a DataConnection */
export class DataError extends Error {
  readonly connection?: DataConnection
  readonly configs?: DataConfig
  constructor(message: string, options?: DataErrorOptions) {
    super(message, options)
    this.connection = options.connection
    this.configs = options.configs
  }
}
