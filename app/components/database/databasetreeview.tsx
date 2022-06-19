//
// databasetreeview.tsx - shows a database connection's tables, indexes, triggers, etc as a treeview panel
//

import * as React from "react"
import { useState, useEffect } from "react"

import { Command, CommandEvent } from "../../lib/commands"
import { TreeView } from "../navigation/treeview"
import { Tree } from "../../lib/tree"
import { DataConnection, DataSchema } from "../../lib/data/connections"

export interface DatabaseTreeViewProps {
  /** Database connection shown in tree view */
  connection?: DataConnection

  /** Will show filtered results based on given string */
  filter?: string

  /** Callback used to dispatch commands back to parent components */
  onCommand?: CommandEvent
}

/** A component used to render a database's table, trigger, views, etc as a treeview */
export function DatabaseTreeView(props: DatabaseTreeViewProps) {
  //
  // state
  //

  const [trees, setTrees] = useState<Tree[]>()
  useEffect(() => {
    if (props.connection) {
      const updateTrees = async () => {
        const trees = await getTrees(props.connection, false)
        setTrees(trees)
      }
      updateTrees().catch(console.error)
    } else setTrees(undefined)
  }, [props.connection])

  //
  // handlers
  //

  /**
   * Callback used when TreeView generates a command like opening
   * a SQL query tab, etc. Some commands are handled directly at this
   * level like the refresh of the schema. Other commands, like a request
   * to open a SQL query tab are passed on to the higher level component.
   */
  async function handleCommand(event: React.SyntheticEvent, command: Command) {
    // console.debug(`DatabaseTreeView.handleCommand - ${command.command}`, command)
    switch (command.command) {
      case "refreshSchema":
        if (props.connection) {
          const trees = await getTrees(props.connection, true)
          setTrees(trees)
        }
        break

      default:
        if (props.onCommand) {
          props.onCommand(event, command)
        }
    }
  }

  //
  // render
  //

  return trees && <TreeView items={trees} filter={props.filter} onCommand={handleCommand} />
}

//
// adapters
//

function _getTableColumnTree(rootId: string, schema: DataSchema, table, column) {
  const tree: Tree = {
    id: `${rootId}/tables/${table.name}/columns/${column.name}`,
    title: column.name,
    type: "column",
    tags: column.tags || [],
  }

  if (column.primaryKey) {
    tree.tags.push({ title: "pk", tooltip: "primary key" })
  }
  if (column.autoIncrement) {
    tree.tags.push({ title: "ai", tooltip: "auto increment" })
  }
  if (column.notNull) {
    tree.tags.push({ title: "nn", tooltip: "not nullable" })
  }

  // is this column a foreign key?
  if (table.foreignKeys) {
    const fk = table.foreignKeys.find((fk) => fk.fromColumn == column.name)
    if (fk) {
      tree.tags.push({ title: "fk", tooltip: `foreign key to ${fk.table}.${fk.toColumn}` })
    }
  }

  if (column.datatype) {
    tree.tags.push(column.datatype.toLowerCase())
  }
  return tree
}

function _getTableTree(
  rootId: string,
  connection: DataConnection,
  schema: DataSchema,
  table,
  variant: "table" | "view"
) {
  const columns = table.columns && table.columns.map((column) => _getTableColumnTree(rootId, schema, table, column))

  let indexes =
    schema.indexes &&
    schema.indexes
      .filter((idx) => idx.table == table.name)
      .map((idx) => {
        return {
          id: `${rootId}/tables/${table.name}/indexes/${idx.name}`,
          title: idx.name,
          type: "index",
          tags: [...idx.columns],
        }
      })

  const commands = []
  // for now we don't have a views panel
  if (variant == "table") {
    commands.push({
      command: "openTable",
      title: "View Structure",
      icon: "info",
      args: {
        connection,
        database: schema.database,
        table: table.name,
      },
    })
  }
  commands.push({
    command: "openQuery",
    title: "Query Data",
    icon: "query",
    args: {
      title: `All ${table.name}`,
      connection,
      database: schema.database,
      sql: `SELECT * FROM '${schema.database}'.'${table.name}'`,
    },
  })
  commands.push({
    command: "pin",
    icon: "pin",
    title: "Pin",
  })

  const tableId = `${rootId}/tables/${table.name}`
  return {
    id: tableId,
    title: table.name,
    type: "table",
    commands,
    children: [
      {
        id: `${rootId}/tables/${table.name}/columns`,
        title: "Columns",
        type: "columns",
        badge: columns?.length > 0 ? columns.length.toString() : "0",
        children: columns?.length > 0 ? columns : undefined,
      },
      {
        id: `${rootId}/tables/${table.name}/indexes`,
        title: "Indexes",
        type: "indexes",
        badge: indexes?.length > 0 ? indexes.length.toString() : "0",
        children: indexes?.length > 0 ? indexes : undefined,
      },
    ],
  }
}

function _getIndexTree(rootId: string, index) {
  let tags = undefined
  if (index.table && index.columns) {
    tags = [{ title: index.table, tooltip: `Index on ${index.table}.${index.columns.join(", ")}` }]
  }
  return {
    id: `${rootId}/indexes/${index.name}`,
    title: index.name,
    type: "index",
    tags,
  }
}

function _getTriggerTree(rootId: string, trigger) {
  let tags = undefined
  if (trigger.table) {
    tags = [{ title: trigger.table, tooltip: `Trigger on ${trigger.table}` }]
  }
  return {
    id: `${rootId}/triggers/${trigger.name}`,
    title: trigger.name,
    type: "trigger",
    tags,
  }
}

/**
 * Converts one or more data schemas obtained from a data connection
 * into trees that can be rendered using <DatabaseTreeView /> component
 */
export async function getTrees(connection: DataConnection, refresh: boolean = false): Promise<Tree[]> {
  const schemas = await connection.getSchemas(refresh)
  const trees: Tree[] = []

  for (const schema of schemas) {
    const rootId = `${connection.id}/${schema.database}`
    const tables =
      schema.tables && schema.tables.map((item) => _getTableTree(rootId, connection, schema, item, "table"))
    const views = schema.views && schema.views.map((item) => _getTableTree(rootId, connection, schema, item, "view"))
    const indexes = schema.indexes && schema.indexes.map((item) => _getIndexTree(rootId, item))
    const triggers = schema.triggers && schema.triggers.map((item) => _getTriggerTree(rootId, item))

    const tree: Tree = {
      id: rootId,
      title: schema.database,
      type: "database",
      icon: "database",
      commands: [
        { command: "openDatabase", icon: "info", title: "View Structure", args: { connection } },
        { command: "refreshSchema", icon: "refresh", title: "Refresh Schema" },
      ],
      children: [
        {
          id: `${rootId}/tables`,
          title: "Tables",
          type: "tables",
          icon: "table",
          badge: tables?.length > 0 ? tables.length.toString() : "0",
          children: tables?.length > 0 && tables,
        },
        {
          id: `${rootId}/views`,
          title: "Views",
          type: "views",
          icon: "view",
          badge: views?.length > 0 ? views.length.toString() : "0",
          children: views?.length > 0 && views,
        },
        {
          id: `${rootId}/indexes`,
          title: "Indexes",
          type: "indexes",
          icon: "index",
          badge: indexes?.length > 0 ? indexes.length.toString() : "0",
          children: indexes?.length > 0 && indexes,
        },
        {
          id: `${rootId}/triggers`,
          title: "Triggers",
          type: "triggers",
          icon: "trigger",
          badge: triggers?.length > 0 ? triggers.length.toString() : "0",
          children: triggers?.length > 0 && triggers,
        },
      ],
    }
    trees.push(tree)
  }
  return trees
}
