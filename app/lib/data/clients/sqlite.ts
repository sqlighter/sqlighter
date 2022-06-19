//
// sqlite.ts - data connection client for SQLite
//

import { DataConnection, DataConfig, DataSchema, DataTableSchema, DataError } from "../connections"
import { Database, QueryExecResult } from "sql.js"

export const SQLITE3_CLIENT_ID = "sqlite3"

// To create a connection you will need to provide a sql.js engine
// https://sql.js.org
//
// If you are running in node get the engine with:
//   import initSqlJs from "sql.js"
//
// If you are running in the browser you'll need something like:
//   const engine = await initSqlJs({
//     locateFile: file => `https://sql.js.org/dist/${file}`
//   })

export class SqliteDataConnection extends DataConnection {
  /** SQLite database connection */
  private _database: Database

  /** Data source schema */
  protected _schemas: DataSchema[]

  public constructor(configs: DataConfig) {
    super(configs)
  }

  /** Returns true if there is an active SQLite database */
  public get isConnected(): boolean {
    return !!this._database
  }

  /**
   * Connects a SqliteDataConnection from given configuration and engine
   * @param configs Connection configuration
   * @param engine window.initSqlJs in the browser or import sql.js in node
   * @returns Connection configured, tested, ready to query
   */
  public async connect(engine?): Promise<void> {
    await super.connect()
    const configs = this._configs

    if (configs.client !== SQLITE3_CLIENT_ID) {
      throw new DataError(`SqliteDataConnection - driver should be ${SQLITE3_CLIENT_ID}`, { configs })
    }

    if (!engine) {
      // works only in browser if loading script is done loading wasm file
      engine = (window as any)?.initSqlJs
      if (!engine) {
        throw new DataError(`SqliteDataConnection - sql.js engine was not found`, { configs })
      }
    }

    try {
      let buffer = null

      // read data from remote url?
      if (configs.connection.url) {
        const response = await fetch(configs.connection.url)
        buffer = new Uint8Array(await response.arrayBuffer()) as Buffer
      }

      if (configs.connection.file) {
        try {
          // reading FileSystemFileHandle?
          if (configs.connection.file instanceof FileSystemFileHandle) {
            // TODO preserve handle a create a writeable connection?
            const file = await configs.connection.file.getFile()
            const data = await file.arrayBuffer()
            buffer = new Uint8Array(data) as Buffer
          }
        } catch (exception) {
          if (!(exception instanceof ReferenceError)) {
            throw exception
          }
        }

        try {
          // read data from File? (browser only, not supported in node)
          if (configs.connection.file instanceof File) {
            const data = await configs.connection.file.arrayBuffer()
            buffer = new Uint8Array(data) as Buffer
          }
        } catch (exception) {
          if (!(exception instanceof ReferenceError)) {
            throw exception
          }
        }

        // reading Buffer?
        if (configs.connection.file instanceof Buffer) {
          buffer = configs.connection.file
        }
      }

      // create database from memory buffer, verify that it's working
      this._database = buffer ? new engine.Database(buffer) : new engine.Database()
      await this.getResult("select 1")
    } catch (exception) {
      console.error(`SqliteDataConnection.connect - exception: ${exception}`, exception)
      throw new DataError("Couln't create connection", { cause: exception, configs: configs })
    }
  }

  //
  // schema
  //

  /** Retrieve column information for a table or a view */
  private async _getTableColumnsSchema(database: string, table: string) {
    // https://www.sqlite.org/pragma.html#pragma_table_xinfo
    const columnsResult = await this.getResult(`pragma '${database}'.table_xinfo('${table}')`)
    const columns = []
    for (const columnResult of columnsResult.values) {
      const tags = []
      if (columnResult[6]) {
        // hidden
        tags.push("hidden")
      }

      let autoIncrement = undefined
      const primaryKey = columnResult[5] ? true : undefined // pk
      if (primaryKey) {
        try {
          const sequenceResult = await this.getResult(`select count(*) from '${database}'.sqlite_sequence where name = '${table}'`)
          console.log(`autoIncrement results`, sequenceResult)
          if (sequenceResult.values[0][0]) {
            autoIncrement = true
          }
        }
        catch {
          // no results, ok!
        }
      }

      columns.push({
        name: columnResult[1], // name
        datatype: columnResult[2] ? columnResult[2] : undefined, // type, eg. INTEGER
        defaultValue: columnResult[4] != null ? columnResult[4] : undefined, // dflt_value
        primaryKey,
        autoIncrement,
        notNull: columnResult[3] ? true : undefined, // notnull
        tags: tags.length > 0 ? tags : undefined,
      })
    }
    return columns
  }

  /** Retrieve foreign key information for a table or a view */
  private async _getTableForeignKeysSchema(database: string, table: string) {
    // https://www.sqlite.org/pragma.html#pragma_foreign_key_list
    try {
      // will throw if no results because of no foreign keys
      const foreignKeysResult = await this.getResult(`pragma '${database}'.foreign_key_list('${table}')`)
      const foreignKeys = []
      for (const foreigKeyResult of foreignKeysResult.values) {
        foreignKeys.push({
          table: foreigKeyResult[2],
          fromColumn: foreigKeyResult[3],
          toColumn: foreigKeyResult[4],
          onUpdate: foreigKeyResult[5] ? foreigKeyResult[5].toString().toLowerCase() : undefined,
          onDelete: foreigKeyResult[6] ? foreigKeyResult[6].toString().toLowerCase() : undefined,
        })
      }
      return foreignKeys.length > 0 ? foreignKeys : undefined
    } catch (exception) {
      // console.warn(`SqliteDataConnection._getTableForeignKeysSchema - ${table}, no results`, exception)
      return undefined
    }
  }

  /** Generate schema for tables or views in given database */
  private async _getTablesSchema(database: string, type: "table" | "view"): Promise<DataTableSchema[]> {
    const tables: DataTableSchema[] = []
    try {
      const tablesResult = await this.getResult(
        `select type, name, sql from '${database}'.sqlite_schema where (type == '${type}') and (name not like 'sqlite_%')`
      )
      for (const tableResult of tablesResult.values) {
        const tableName = tableResult[1] as string // or view

        let rows = undefined
        try {
          // number of rows in table
          const rowsResult = await this.getResult(`select count(*) 'rows' from main.'${tableName}'`)
          if (rowsResult) {
            rows = rowsResult.values[0][0] // first and only result
          }
        } catch (exception) {
          console.error(`SqliteDataConnection._getTableSchema - error while calculating number of rows`, exception)
        }

        tables.push({
          name: tableName,
          sql: tableResult[2] ? tableResult[2].toString() : undefined,
          columns: await this._getTableColumnsSchema(database, tableName),
          foreignKeys: await this._getTableForeignKeysSchema(database, tableName),
          stats: { rows },
        })
      }
      tables.sort((a, b) => a.name.localeCompare(b.name))
      return tables
    } catch (exception) {
      console.warn(
        `SqliteDataConnection._getTablesSchema - database: ${database}, type: ${type}, exception:${exception}`,
        exception
      )
      return undefined
    }
  }

  /** Generates schema for indexes */
  private async _getIndexesSchema(database: string) {
    const indexes = []
    const indexesResult = await this.getResult(
      `select name, tbl_name, sql from '${database}'.sqlite_schema where type == 'index'`
    )
    for (const indexResult of indexesResult.values) {
      const indexName = indexResult[0] as string // or view
      const columnsResult = await this.getResult(`pragma '${database}'.index_info('${indexName}')`)
      const columns = columnsResult.values.map((v) => v[2])
      indexes.push({
        name: indexName,
        sql: indexResult[2]?.toString(),
        table: indexResult[1]?.toString(),
        columns,
      })
    }
    indexes.sort((a, b) => a.name.localeCompare(b.name))
    return indexes
  }

  /** Generates schema for triggers */
  private async _getTriggersSchema(database: string) {
    try {
      const triggers = []
      const triggersResult = await this.getResult(
        `select name, tbl_name, sql from '${database}'.sqlite_schema where type == 'trigger'`
      )
      for (const triggerResult of triggersResult.values) {
        triggers.push({
          name: triggerResult[0] as string,
          sql: triggerResult[2]?.toString(),
          table: triggerResult[1]?.toString(),
        })
      }
      triggers.sort((a, b) => a.name.localeCompare(b.name))
      return triggers.length > 0 ? triggers : undefined
    } catch (exception) {
      console.warn(`SqliteDataConnection._getTriggersSchema - ${database} has no triggers`, exception)
    }
    return undefined
  }

  /** 
   * Returns database schema in simplified, ready to use format.
   * @param refresh True if schema should be refreshed (default is using cached version if available)
   * @returns An array with a single DataSchema extracted from this database
   * @see https://www.sqlite.org/pragma.html
   */
  public async getSchemas(refresh: boolean = false): Promise<DataSchema[]> {
    if (this._schemas && !refresh) {
      return this._schemas
    }

    try {
      // database name to be used for schema
      let database = "main"
      if (this.configs.connection.database) {
        database = this.configs.connection.database
      }

      // calculate database size
      const versionResult = await this.getResult(`pragma '${database}'.schema_version`)
      const sizeResults = await this.getResults("pragma page_size; pragma page_count;")

      return [
        {
          database,
          tables: await this._getTablesSchema(database, "table"),
          views: await this._getTablesSchema(database, "view"),
          indexes: await this._getIndexesSchema(database),
          triggers: await this._getTriggersSchema(database),
          stats: {
            version: versionResult.values[0][0].toString(),
            size: (sizeResults[0].values[0][0] as number) * (sizeResults[1].values[0][0] as number),
          },
        },
      ]
    } catch (exception) {
      console.error(`SqliteDataConnection.getSchema - exception: ${exception}`, exception)
      throw exception
    }
  }

  //
  // query
  //

  /** Run a SQL query and return zero o more results from it */
  public async getResults(sql: string): Promise<QueryExecResult[]> {
    try {
      return this._database.exec(sql)
    } catch (exception) {
      console.error(`SqliteDataConnection.getResults - sql: ${sql}, exception: ${exception}`, exception)
      throw exception
    }
  }

  /** Run a SQL query that generates a single result set */
  public async getResult(sql: string): Promise<QueryExecResult> {
    const results = await this.getResults(sql)
    if (results.length != 1) {
      throw new Error(`SqliteDataConnection.getResult - sql: '${sql}' returned ${results.length} results`)
    }
    return results[0]
  }

  /**
   * Returns the number of changed rows (modified, inserted or deleted) by the latest
   * completed INSERT, UPDATE or DELETE statement on the database. Executing any other
   * type of SQL statement does not modify the value returned by this function.
   */
  public async getRowsModified(): Promise<number> {
    // TODO this number needs to somehow reset when new queries are run
    return this._database.getRowsModified()
  }

  //
  // export
  //

  /**
   * True if data connection can export data for the given database, table and format
   * @param database Which specific database to export? Default null for entire database
   * @param table Specific table to be exported, default null for all contents
   * @param format Specific format to export in, default null for native format
   * @returns True if this connection can perform the requested data export
   */
  public canExport(database?: string, table?: string, format?: string): boolean {
    // can only export entire database in native format
    if (!database && !table && !format) {
      return true
    }
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
    const data = this._database.export()
    console.debug(
      `SqliteDataConnection.export - database: ${database}, table: ${table}, format: ${format} > size: ${data?.length}`
    )
    return { data, type: "application/x-sqlite3" }
  }
}

// class also acts as default export for module
export default SqliteDataConnection
