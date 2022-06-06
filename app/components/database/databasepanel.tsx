//
// databasepanel.tsx - a panel used to show the schema of connected databases
// normally used as an activity with an icon in the activity bar and panel
// inside the sidebar. helps with new connections, shows tables, views, etc.
//

import { Theme, SxProps } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { DataConnection } from "../../lib/sqltr/connections"
import { DatabaseTreeView } from "./databasetreeview"
import { ConnectionPicker } from "./connectionpicker"
import { PanelProps } from "../navigation/panel"

// Styles applied to component and subcomponents
export const DatabasePanel_SxProps: SxProps<Theme> = {
  ".DatabasePanel-header": {
    width: 1,
    padding: 1,
  },
}

/** Database panel in the sidebar */
export interface DatabasePanelProps extends PanelProps {
  /** Currently selected connection */
  connection?: DataConnection
  /** List of available connections (which may or may not be live) */
  connections?: DataConnection[]
}

/** A sidebar panel used to display the schema of connected databases */
export function DatabasePanel(props: DatabasePanelProps) {
  return (
    <Box className="DatabasePanel-root" sx={DatabasePanel_SxProps}>
      <Box className="DatabasePanel-header">
        <Typography variant="overline">Database Explorer</Typography>
        <ConnectionPicker connection={props.connection} connections={props.connections} onCommand={props.onCommand} />
      </Box>
      {props.connection && <DatabaseTreeView connection={props.connection} onCommand={props.onCommand} />}
    </Box>
  )
}
