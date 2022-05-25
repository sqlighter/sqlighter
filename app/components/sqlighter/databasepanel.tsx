//
// databasepanel.tsx - a panel used to show the schema of connected databases
// normally used as an activity shown with an icon in the activity bar and panel
// inside the sidebar. helps with new connections, shows tables, views, etc.
//

import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { DataConnection } from "../../lib/sqltr/connections"
import { DatabaseTreeView } from "./databasetreeview"
import { ConnectionsMenu } from "./connectionsmenu"

export interface DatabasePanelProps {
  
  /** Currently selected connection */
  connection?: DataConnection

  /** List of available connections (which may or may not be live) */
  connections?: DataConnection[]

  /**
   * Callback used when the view generates an app level command,
   * for example this may happen when the view generates a command
   * to view the structure of a table that the user clicked on, etc.
   */
  onCommand?: (event: React.SyntheticEvent, command: string, args?) => void
}

/** A sidebar panel used to display the schema of connected databases */
export function DatabasePanel(props: DatabasePanelProps) {
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

      default:
        if (props.onCommand) {
          props.onCommand(event, command, args)
        }
        break
    }
  }

  //
  // render
  //

  return (
    <Box className="DatabasePanel-root" sx={{ height: "100%", overflowY: "scroll" }}>
      <Box sx={{ padding: 1 }}>
        <Typography variant="overline">Database Explorer</Typography>
        <ConnectionsMenu connection={props.connection} connections={props.connections} onCommand={props.onCommand} />
      </Box>
      {props.connection && <DatabaseTreeView connection={props.connection} onCommand={props.onCommand} />}
    </Box>
  )
}
