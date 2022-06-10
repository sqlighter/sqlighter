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
      case "sqlighter.refreshSchema":
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

function _getTableColumnTree(schema: DataSchema, table, column) {
  const tree: Tree = {
    id: `${schema.database}/tables/${table.name}/columns/${column.name}`,
    title: column.name,
    type: "column",
    tags: [],
  }

  if (column.constraints) {
    // show primary key using 🔑 emoji instead of plain text?
    tree.tags.push(
      ...column.constraints.map((c) => {
        switch (c) {
          case "primary key":
            return { title: "pk", tooltip: c }
          case "auto increment":
            return { title: "ai", tooltip: c }
        }
        return c
      })
    )
  }
  tree.tags.push(column.datatype)

  return tree
}

function _getTableTree(schema: DataSchema, table) {
  const columns = table.columns && table.columns.map((column) => _getTableColumnTree(schema, table, column))

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
    commands: [
      {
        command: "sqlighter.viewStructure",
        icon: "info",
        title: "View Structure",
        args: { title: `All ${table.name}`, sql: `SELECT * FROM ${table.name}` },
      },
      {
        // for now we open a generic query panel and select the table's data
        // TODO launch a table panel that display, edit, insert and remove rows
        title: "View Data",
        icon: "query",
        command: "sqlighter.viewQuery",
        args: { title: `All ${table.name}`, sql: `SELECT * FROM ${table.name}` },
      },
      { command: "sqlighter.pin", icon: "pin", title: "Pin" },
    ],
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

function _getTriggerTree(schema: DataSchema, trigger) {
  return {
    id: `${schema.database}/triggers/${trigger.name}`,
    title: trigger.name,
    type: "trigger",
    tags: trigger.on ? [trigger.on] : undefined,
  }
}

function _getViewTree(schema: DataSchema, view) {
  return {
    id: `${schema.database}/views/${view.name}`,
    title: view.name,
    type: "view",
    tags: view.from ? [view.from] : undefined,
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
    const tables = schema.tables.map((table) => _getTableTree(schema, table))
    const triggers = schema.triggers.map((trigger) => _getTriggerTree(schema, trigger))
    const views = schema.views.map((view) => _getViewTree(schema, view))

    const tree: Tree = {
      id: schema.database,
      title: schema.database,
      type: "database",
      icon: "database",
      commands: [{ command: "sqlighter.refreshSchema", icon: "refresh", title: "Refresh" }],
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
          id: `${schema.database}/views`,
          title: "Views",
          type: "views",
          icon: "view",
          badge: views.length.toString(),
          children: views,
        },
        {
          id: `${schema.database}/triggers`,
          title: "Triggers",
          type: "triggers",
          icon: "trigger",
          badge: triggers.length.toString(),
          children: triggers,
        },
      ],
    }
    trees.push(tree)
  }
  return trees
}
