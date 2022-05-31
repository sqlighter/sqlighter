//
// sqlite.ts - DataSource for SQLite databases
//

import initSqlJs, { Database, QueryExecResult } from "sql.js"
import sqliteParser from "sqlite-parser"
import { DataConnection, DataConnectionConfigs, DataSchema } from "../connections"
import { generateId } from "../../items/items"

function camelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, "")
}

export class SqliteDataConnection extends DataConnection {
  /** SQLite database connection */
  private _database: Database

  /** Data source schema */
  protected _schemas: DataSchema[]

  protected constructor(configs: DataConnectionConfigs) {
    super(configs)

    // TODO should use filename that buffer was generated from
    this.title = "chinook.db" //(this._database as any)?.filename
  }

  public static async create(configs: DataConnectionConfigs, engine): Promise<SqliteDataConnection> {
    try {
      if (typeof configs.connection === "string") {
        throw new Error("Not implemented yet")
      }

      // TODO open sqlite from filename, url, etc.
      if (configs.client !== "sqlite3" || !configs.connection.buffer) {
        throw new Error("SqliteDataConnection.connect - can only create in memory connections from buffer data")
      }
      /*
      const engine = await initSqlJs({
        // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
        // You can omit locateFile completely when running in node
        // locateFile: file => `https://sql.js.org/dist/${file}`
      })
*/

      // create database from memory buffer
      const connection = new SqliteDataConnection(configs)
      connection._database = new engine.Database(configs.connection.buffer)

      /*
      try {
        if (window) {
          // @ts-ignore
          if (window.loadSQL) {
            console.log("Should try initSQLJS")
            // @ts-ignore
            const SQL = await window.loadSQL()
            connection._database = SQL(configs.connection.buffer)
          }
        }
      } catch (exception) {
        const SQL = await initSqlJs({
          // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
          // You can omit locateFile completely when running in node
          // locateFile: file => `https://sql.js.org/dist/${file}`
        })
        connection._database = new SQL.Database(configs.connection.buffer)
      }
*/
      // register connection in
      DataConnection._connections.push(connection)

      return connection
    } catch (exception) {
      console.error(`SqliteDataConnection.create - exception: ${exception}`, exception)
      throw exception
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

  private _getTableSchema(entities, tableEntity) {
    const tableAst = tableEntity.ast
    const tableName = tableAst.name.name

    const tableSchema: any = {
      name: tableName,
      sql: tableEntity.sql,
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

  private _getViewSchema(entities, viewEntity) {
    const viewAst = viewEntity.ast
    const viewName = viewAst.target.name

    // TODO parse view's columns, expressions, etc
    return {
      name: viewName,
      sql: viewEntity.sql,
      from: viewAst.result?.from?.name,
    }
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
      if (typeof this._configs?.connection == "object") {
        if (this._configs.connection.database) {
          database = this._configs.connection.database
        }
      }

      // convert entities abstract syntax tree to simplified schema structure
      const tables = entities
        .filter((entity) => entity.type == "table")
        .map((tableEntity) => this._getTableSchema(entities, tableEntity))
        .sort((a, b) => (a.name < b.name ? -1 : 1))

      const views = entities
        .filter((entity) => entity.type == "view")
        .map((viewEntity) => this._getViewSchema(entities, viewEntity))
        .sort((a, b) => (a.name < b.name ? -1 : 1))

      const triggers = entities
        .filter((entity) => entity.type == "trigger")
        .map((triggerEntity) => this._getTriggerSchema(entities, triggerEntity))
        .sort((a, b) => (a.name < b.name ? -1 : 1))

      return [
        {
          database,
          tables,
          triggers,
          views,
        },
      ]
    } catch (exception) {
      console.error(`SqliteDataConnection.getSchema - exception: ${exception}`, exception)
      throw exception
    }
  }

  //
  // data
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
}

// class also acts as default export for module
export default SqliteDataConnection
