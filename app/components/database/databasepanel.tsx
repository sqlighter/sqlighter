//
// databasepanel.tsx - a panel used to show the schema of connected databases
// normally used as an activity shown with an icon in the activity bar and panel
// inside the sidebar. helps with new connections, shows tables, views, etc.
//

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { CommandEvent } from "../commands"
import { DataConnection } from "../../lib/sqltr/connections"
import { DatabaseTreeView } from "./databasetreeview"
import { ConnectionsMenu } from "./connectionsmenu"
import { PanelProps } from "../navigation/panel"

export interface DatabasePanelProps extends PanelProps {
  /** Currently selected connection */
  connection?: DataConnection
  /** List of available connections (which may or may not be live) */
  connections?: DataConnection[]
}

/** A sidebar panel used to display the schema of connected databases */
export function DatabasePanel(props: DatabasePanelProps) {
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
