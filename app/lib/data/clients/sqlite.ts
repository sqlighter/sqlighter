//
// sqlite.ts - data connection client for SQLite
//

import { DataConnection, DataConfig, DataSchema, DataError } from "../connections"
import { Database, QueryExecResult } from "sql.js"
import sqliteParser from "sqlite-parser"

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

      // TODO fix for empty database
      // await this.getResult("select * from sqlite_schema")

      console.debug(`SqliteDataConnection - created ${this.id}`, this)
    } catch (exception) {
      console.error(`SqliteDataConnection - exception: ${exception}`, exception)
      throw new DataError("Couln't create connection", { cause: exception, configs: configs })
    }
  }

  //
  // schema
  //

  private _getTableColumnSchema(columnAst) {
    // add tag for data type like 'integer', 'nvarchar(30)', 'decimal(10, 2)'
    let datatype = columnAst.datatype.variant
    if (columnAst.datatype.args && columnAst.datatype.args.variant == "list") {
      const args = columnAst.datatype.args.expression.map((expr) => expr.value).join(", ")
      datatype += `(${args})`
    }

    const columnSchema: any = {
      name: columnAst.name,
      datatype,
    }

    // add tags for attributes like 'primary key', 'not null'
    const constraints = []
    for (const definition of columnAst.definition) {
      // show primary key 🔑 emoji instead of plain text?
      // column.tags.push(definition.variant == "primary key" ? "🔑" : definition.variant)
      constraints.push(definition.variant)
      if (definition.autoIncrement) {
        constraints.push("auto increment")
      }
    }
    if (constraints.length > 0) {
      columnSchema.constraints = constraints
    }

    return columnSchema
  }

  private async _getTableSchema(entities, tableEntity) {
    const tableAst = tableEntity.ast
    const tableName = tableAst.name.name

    const tableSchema: any = {
      name: tableName,
      sql: tableEntity.sql,
    }

    try {
      // number of rows in table
      const result = await this.getResult(`select count(*) 'rows' from main.'${tableName}'`)
      tableSchema.stats = {
        rows: result.values[0][0], // first and only result
      }
    } catch (exception) {
      console.error(`SqliteDataConnection._getTableSchema - error while calculating number of rows`, exception)
    }

    const columns = tableAst.definition
      .filter((definition) => definition.variant == "column")
      .map((columnAst) => this._getTableColumnSchema(columnAst))
    if (columns.length > 0) {
      tableSchema.columns = columns
    }

    const indexes = entities
      .filter((entity) => entity.type == "index" && entity.ast.on.name == tableName)
      .map((indexEntity) => {
        const indexAst = indexEntity.ast
        return {
          name: indexEntity.name,
          sql: indexEntity.sql,
          columns: indexAst.on.columns.map((columnAst) => columnAst.name),
        }
      })
    if (indexes.length > 0) {
      tableSchema.indexes = indexes
    }

    // TODO add table with multiple foreign keys and related schema test
    const fk = tableAst.definition
      .filter((definition) => definition.variant == "constraint" && definition.definition[0].variant == "foreign key")
      .map((fkAst) => {
        const onUpdate = fkAst.definition[0].action.filter((a) => a.variant == "on update").map((a) => a.action)
        const onDelete = fkAst.definition[0].action.filter((a) => a.variant == "on delete").map((a) => a.action)

        return {
          columns: fkAst.columns.map((c) => c.name),
          references: {
            table: fkAst.definition[0].references.name,
            columns: fkAst.definition[0].references.columns.map((c) => c.name),
            onUpdate: onUpdate && onUpdate[0],
            onDelete: onDelete && onDelete[0],
          },
        }
      })
    if (fk.length > 0) {
      tableSchema.foreignKeys = fk
    }

    return tableSchema
  }

  private async _getViewSchema(entities, viewEntity) {
    const viewAst = viewEntity.ast
    const viewName = viewAst.target.name
    const viewSchema = {
      name: viewName,
      sql: viewEntity.sql,
      from: viewAst.result?.from?.name,
      columns: null,
      stats: null,
    }

    try {
      // number of rows in view
      const statsResult = await this.getResult(`select count(*) 'rows' from main.'${viewSchema.name}'`)
      viewSchema.stats = {
        // count is first and only result
        rows: statsResult.values[0][0],
      }

      // extract row names by running a simple select query for a single line
      // we could extract columns from the ast but there are many variants like views
      // from simple selects, views from joins, unions, calculations, etc...
      const columnsResult = await this.getResult(`select * from main.'${viewSchema.name}' limit 1`)
      viewSchema.columns = columnsResult.columns.map((column) => {
        return { name: column }
      })
    } catch (exception) {
      console.error(
        `SqliteDataConnection._getViewSchema - view: '${viewName}', exception: ${exception}`,
        viewSchema,
        exception
      )
    }

    return viewSchema
  }

  private _getTriggerSchema(entities, triggerEntity) {
    const triggerAst = triggerEntity.ast
    const triggerName = triggerAst.target.name

    // TODO parse view's columns, expressions, etc
    return {
      name: triggerName,
      sql: triggerEntity.sql,
      on: triggerEntity.ast.on?.name,
    }
  }

  /**
   * This method will run a query on 'sqlite_schema' to retrieve the SQL create statements for all
   * the tables, indexes, triggers and views in the database. It will then parse the SQL statements
   * and create an abstract syntax tree (AST) for each entity. These ASTs will then be used to quickly
   * retrieve information like table's column, indexes constraints and so on.
   * @param refresh True if schema should be refreshed (default is using cached version if available)
   * @returns An array with a single DataSchema extracted from this database
   * @see https://www.sqlite.org/schematab.html
   * @see https://www.npmjs.com/package/sqlite-parser
   * @internal
   */
  public async _getEntities() {
    try {
      // retrieve create statements for all tables, indexes, trigger and views from which we'll parse the schema
      const query = "select type, tbl_name, sql from sqlite_schema where tbl_name not like 'sqlite_%'"
      const result = await this.getResult(query)

      // parse sql into abstract syntax tree for each database entity
      const entities: any[] = []
      for (const value of result.values) {
        const entity = value[0] as string,
          name = value[1] as string,
          sql = value[2] as string
        if (sql) {
          try {
            let ast = sqliteParser(sql)
            ast = ast.statement[0] // remove statement list wrapper
            const name = ast.name?.name || ast.target?.name

            // return type of entity, its name, sql create statement and its abstract syntax tree
            entities.push({ type: ast.format, name, sql, ast })
          } catch (exception) {
            console.error(
              `SqliteDataConnection.getEntities - ${entity}: ${name}, exception: ${exception}`,
              sql,
              exception
            )
            throw exception
          }
        } else {
          console.warn(`SqliteDataConnection.getEntities - ${entity}: ${name} doesn't have a SQL schema`)
        }
      }
      return entities
    } catch (exception) {
      console.error(`SqliteDataConnection.getEntities - exception: ${exception}`, exception)
      throw exception
    }
  }

  /** Returns database schema in simplified, ready to use format.
   * @param refresh True if schema should be refreshed (default is using cached version if available)
   * @returns An array with a single DataSchema extracted from this database
   */
  public async getSchemas(refresh: boolean = false): Promise<DataSchema[]> {
    if (this._schemas && !refresh) {
      return this._schemas
    }

    try {
      // get list of database entities with name, type, sql create statement and abstract syntax tree (AST)
      const entities = await this._getEntities()

      // database name to be used for schema
      let database = "main"
      if (this.configs.connection.database) {
        database = this.configs.connection.database
      }

      // convert entities abstract syntax tree to simplified schema structure
      const tables = []
      for (const tableEntity of entities) {
        if (tableEntity.type === "table") {
          tables.push(await this._getTableSchema(entities, tableEntity))
        }
      }
      tables.sort((a, b) => (a.name < b.name ? -1 : 1))

      // convert entities abstract syntax tree to simplified schema structure
      const views = []
      for (const viewEntity of entities) {
        if (viewEntity.type === "view") {
          views.push(await this._getViewSchema(entities, viewEntity))
        }
      }
      views.sort((a, b) => (a.name < b.name ? -1 : 1))

      const triggers = entities
        .filter((entity) => entity.type == "trigger")
        .map((triggerEntity) => this._getTriggerSchema(entities, triggerEntity))
        .sort((a, b) => (a.name < b.name ? -1 : 1))

      // calculate database size
      const sizeResults = await this.getResults("pragma page_size; pragma page_count;")

      return [
        {
          database,
          tables,
          triggers,
          views,
          stats: {
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
