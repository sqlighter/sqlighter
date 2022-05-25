//
// databasepanel.tsx - a panel used to show the schema of connected databases
// normally used as an activity shown with an icon in the activity bar and panel
// inside the sidebar. helps with new connections, shows tables, views, etc.
//

import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

import { useSqljs } from "../../lib/useDB"
import { DataConnection, DataConnectionConfigs } from "../../lib/sqltr/connections"
import { SqliteDataConnection } from "../../lib/sqltr/databases/sqlite"
import { DatabaseTreeView } from "./databasetreeview"

/** A sidebar panel used to display the schema of connected databases */
export function DatabasePanel() {
  const sqljs = useSqljs()
  useEffect(() => {
    if (sqljs) {
      console.log("DatabasePanel - has sqljs")
    }
  }, [sqljs])

  // database connection that is currently being rendered
  const [connection, setConnection] = useState<DataConnection>(null)

  //
  // handlers
  //

  function handleCommand(event: React.SyntheticEvent, command: string, args) {
    console.debug(`DatabasePanel.handleCommand - ${command}`, args)

    switch (command) {
      case "sqlighter.collapseItem":
      case "sqlighter.expandItem":
        // handled by treeview
        break

      case "sqlighter.viewData":
        break
      case "sqlighter.viewStructure":
        break
    }
  }

  async function handleOpenClick(e) {
    if (sqljs) {
      //      const response = await fetch("/chinook.sqlite")
      const response = await fetch("/test.db")
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
    } else [console.error(`DatabasePanel.handleOpenClick - sqljs engine not loaded`)]
  }

  //
  // render
  //

  return (
    <Box className="DatabasePanel-root" sx={{ height: "100%", overflowY: "scroll" }}>
      <Box sx={{ padding: 1 }}>
        <Typography variant="overline">Database Explorer</Typography>
        {!connection && <Box>
          <Button variant="outlined" onClick={handleOpenClick}>
            Open
          </Button>
        </Box>}
      </Box>
      {connection && <DatabaseTreeView connection={connection} onCommand={handleCommand} />}
    </Box>
  )
}
