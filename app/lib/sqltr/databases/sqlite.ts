//
// sqlite.ts - DataSource for SQLite databases
//

import initSqlJs, { Database, QueryExecResult } from "sql.js"
import sqliteParser  from "sqlite-parser"
import { DataConnection, DataConnectionConfigs } from "../connections"

export class SqliteDataConnection extends DataConnection {
  /** SQLite database connection */
  private _database: Database

  /** Database scheme abstract syntax tree (AST) */
  private _schema: object[]

  protected constructor(configs: DataConnectionConfigs) {
    super(configs)
  }

  public static async create(configs: DataConnectionConfigs) {
    try {
      const SQL = await initSqlJs({
        // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
        // You can omit locateFile completely when running in node
        // locateFile: file => `https://sql.js.org/dist/${file}`
      })

      // create database from memory buffer
      // TODO open sqlite from url, etc.
      const connection = new SqliteDataConnection(configs)
      connection._database = new SQL.Database(configs.buffer)
      return connection
    } catch (exception) {
      console.error(`SqliteDataConnection.create - exception: ${exception}`, exception)
      throw exception
    }
  }

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
   * This method will run a query on 'sqlite_schema' to retrieve the SQL create statements for all
   * the tables, indexes, triggers and views in the database. It will then parse the SQL statements
   * and create an abstract syntax tree (AST) for each entity. These ASTs will then be used to quickly
   * retrieve information like table's column, indexes constraints and so on.
   * @param refresh True if schema should be refreshed (default is using cached version if available)
   * @returns An array of abstract syntax tree definitions of the database schema
   * @see https://www.sqlite.org/schematab.html
   * @see https://www.npmjs.com/package/sqlite-parser
   */
  public async getSchema(refresh: boolean = false): Promise<object[]> {
    if (refresh || !this._schema) {
      const query = "select type, tbl_name, sql from sqlite_schema"
      const result = await this.getResult(query)

      const schema = []
      for (const value of result.values) {
        const entity = value[0],
          name = value[1],
          sql = value[2]
        if (sql) {
          try {
            console.log(sql)
            const ast = sqliteParser(sql)
            const createAst = ast.statement[0]
            const name = createAst.name?.name || createAst.target?.name
            schema.push({type: createAst.format, name, sql, ast})
          } catch (exception) {
            console.error(`SqliteDataConnection.getSchema - ${entity}: ${name}, exception: ${exception}`, sql, exception)
            throw exception
          }
        } else {
          console.warn(`SqliteDataConnection.getSchema - ${entity}: ${name} doesn't have a SQL schema`)
        }
      }
      this._schema = schema
    }
    return this._schema
  }
}

// class also acts as default export for module
export default SqliteDataConnection
