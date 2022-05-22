//
// connections.ts - base class for data connections that can provide data, schemas, etc.
//

import { QueryExecResult } from "sql.js"
import { Tree } from "../data/tree"

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
  // tree
  //

  private _getTableColumnTree(schema, table, column) {
    const tree: Tree = {
      id: `${schema.database}/tables/${table.name}/columns/${column.name}`,
      title: column.name,
      type: "column",
      tags: [],
    }

    if (column.constraints) {
      // show primary key using 🔑 emoji instead of plain text?
      tree.tags.push(...column.constraints)
    }
    tree.tags.push(column.datatype)

    return tree
  }

  private _getTableTree(schema, table) {
    const columns = table.columns && table.columns.map((column) => this._getTableColumnTree(schema, table, column))

    const indexes =
      table.indexes &&
      table.indexes.map((index) => {
        return {
          id: `${schema.database}/tables/${table.name}/indexes/${index.name}`,
          title: index.name,
          type: "index",
          tags: [...index.columns],
        }
      })

    return {
      id: `${schema.database}/tables/${table.name}`,
      title: table.name,
      type: "table",
      children: [
        {
          id: `${schema.database}/tables/${table.name}/columns`,
          title: "Columns",
          type: "columns",
          badge: (columns ? columns.length : 0).toString(),
          children: columns,
        },
        {
          id: `${schema.database}/tables/${table.name}/indexes`,
          title: "Indexes",
          type: "indexes",
          badge: (indexes ? indexes.length : 0).toString(),
          children: indexes,
        },
      ],
    }
  }

  private _getTriggerTree(schema, trigger) {
    return {
      id: `${schema.database}/triggers/${trigger.name}`,
      title: trigger.name,
      type: "trigger",
      tags: trigger.on ? [trigger.on] : undefined,
    }
  }

  private _getViewTree(schema, view) {
    return {
      id: `${schema.database}/views/${view.name}`,
      title: view.name,
      type: "view",
      tags: view.from ? [view.from] : undefined,
    }
  }

  public async getTrees(refresh: boolean = false): Promise<Tree[]> {
    const schemas = await this.getSchemas(refresh)
    const trees: Tree[] = []

    for (const schema of schemas) {
      const tables = schema.tables.map((table) => this._getTableTree(schema, table))
      const triggers = schema.triggers.map((trigger) => this._getTriggerTree(schema, trigger))
      const views = schema.views.map((view) => this._getViewTree(schema, view))

      const tree: Tree = {
        id: schema.database,
        title: schema.database,
        type: "database",
        icon: "database",
        children: [
          {
            id: `${schema.database}/tables`,
            title: "Tables",
            type: "tables",
            icon: "table",
            badge: tables.length.toString(),
            children: tables,
          },
          {
            id: `${schema.database}/triggers`,
            title: "Triggers",
            type: "triggers",
            icon: "trigger",
            badge: triggers.length.toString(),
            children: triggers,
          },
          {
            id: `${schema.database}/views`,
            title: "Views",
            type: "views",
            icon: "view",
            badge: views.length.toString(),
            children: views,
          },
        ],
      }
      trees.push(tree)
    }
    return trees
  }

  //
  // data
  //

  /** Run a SQL query and return zero o more results from it */
  public abstract getResults(sql: string): Promise<QueryExecResult[]>

  /** Run a SQL query that generates a single result set */
  public abstract getResult(sql: string): Promise<QueryExecResult>
}
