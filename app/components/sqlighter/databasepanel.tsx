//
// databasepanel.tsx - a panel used to show the schema of connected databases
// normally used as an activity shown with an icon in the activity bar and panel
// inside the sidebar. helps with new connections, shows tables, views, etc.
//

import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

import { Command } from "../../lib/data/commands"
import { FAKE_SCHEMAS } from "../../lib/data/sources"

import { useSqljs } from "../../lib/useDB"
import { DataConnection, DataConnectionConfigs } from "../../lib/sqltr/connections"
import { SqliteDataConnection } from "../../lib/sqltr/databases/sqlite"

import { Tree } from "../../lib/data/tree"
import { TreeView } from "../navigation/treeview"

var testConnection = null

async function getConnectionsTree(): Promise<Tree> {
  const connection = DataConnection.getConnections()

  return null
}

/** A sidebar panel used to display the schema of connected databases */
export function DatabasePanel() {
  const sqljs = useSqljs()
  useEffect(() => {
    if (sqljs) {
      console.log("DatabasePanel - has sqljs")
    }
  }, [sqljs])

  const [items, setItems] = useState(FAKE_SCHEMAS)

  const [connection, setConnection] = useState(null)

  const [tree, setTree] = useState(null)

  //
  // handlers
  //

  function handleCommand(event: React.SyntheticEvent, command: Command, item: Tree) {
    console.debug(`DatabasePanel.handleCommand - command: ${command.command}, itemId: ${item.id}`, command, item)

    switch (command.command) {
      case "sqltr.collapseItem":
      case "sqltr.expandItem":
        // handled by treeview
        break

      case "sqltr.viewData":
        break
      case "sqltr.viewStructure":
        break
    }
  }

  async function handleOpenClick(e) {
    if (sqljs) {
      const response = await fetch("/chinook.sqlite")
      const buffer = await response.arrayBuffer()
      console.log("downloaded", response, buffer)
      const configs: DataConnectionConfigs = {
        client: "sqlite3",
        connection: {
          buffer: new Uint8Array(buffer) as Buffer,
        },
      }

      const connection = await SqliteDataConnection.create(configs, sqljs)
      console.log("connection", connection)
      setConnection(connection)
      console.log("downloaded", response, buffer)

      const tree = await getTreeItems(connection)
      setTree(tree)
    } else [console.error(`DatabasePanel.handleOpenClick - sqljs engine not loaded`)]
  }

  async function getTreeItems(connection): Promise<Tree[]> {
    console.debug(`DatabasePanel.getTreeItems - ${connection}`)

    const result = await connection.getResult("select * from customers")
    console.log("select 1", result)

    const schema = await connection.getSchema()

    const rootId = "main"

    const tables = schema
      .filter((s) => s.type == "table")
      .map((s) => {
        const columns = s.ast.definition
          .filter((d) => d.variant == "column")
          .map((d) => {
            return {
              id: `${rootId}/tables/${s.name}/columns/${d.name}`,
              title: d.name,
              icon: "column",
            }
          })

        return {
          id: `${rootId}/tables/${s.name}`,
          title: s.name,
          icon: "table",
          children: [
            {
              id: `${rootId}/tables/${s.name}/columns`,
              title: "Columns",
              icon: "columns",
              badge: columns.length.toString(),
              children: columns,
            },
          ],
        }
      })

    const tree: Tree = {
      id: rootId,
      title: "chinook.db",
      icon: "database",
      children: [
        {
          id: `${rootId}/tables`,
          title: "Tables",
          icon: "table",
          children: tables,
        },
      ],
    }

    console.debug([tree])
    return [tree]
  }

  //
  // render
  //
  //       <TreeView items={items} onCommand={handleCommand} />

  return (
    <>
      <Box>Database schema panel (TBD)</Box>
      <Button variant="outlined" onClick={handleOpenClick}>
        Open
      </Button>

      {!tree && <>No tree</>}
      {tree && <TreeView items={tree} onCommand={handleCommand} />}
    </>
  )
}
