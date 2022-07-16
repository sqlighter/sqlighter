//
// DatabaseActivity.tsx - a panel used to show the schema of connected databases
// normally used as an activity with an icon in the activity bar and panel
// inside the sidebar. helps with new connections, shows tables, views, etc.
//

import { Theme, SxProps } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { DataConnection } from "../../lib/data/connections"
import { DatabaseTreeView } from "../database/databasetreeview"
import { ConnectionPicker } from "../database/connectionpicker"
import { PanelProps } from "../navigation/panel"
import { Empty } from "../ui/empty"
import { IconButton } from "../ui/iconbutton"

// Styles applied to component and subcomponents
export const DatabaseActivity_SxProps: SxProps<Theme> = {
  ".DatabaseActivity-header": {
    width: 1,
    padding: 1,
  },
}

/** Database panel in the sidebar */
export interface DatabaseActivityProps extends PanelProps {
  /** Currently selected connection */
  connection?: DataConnection
  /** List of available connections (which may or may not be live) */
  connections?: DataConnection[]
}

/** A sidebar panel used to display the schema of connected databases */
export function DatabaseActivity(props: DatabaseActivityProps) {
  //
  // render
  //

  function renderEmpty() {
    return (
      <Empty title="No database yet" icon="database">
        <IconButton
          onCommand={props.onCommand}
          command={{
            command: "openFile",
            title: "Open",
            description: "Open a database or .csv file",
            icon: "fileOpen",
            args: {
              label: true,
              color: "primary",
            },
          }}
        />
      </Empty>
    )
  }

  const hasConnections = props.connections?.length > 0
  return (
    <Box className="DatabaseActivity-root" sx={DatabaseActivity_SxProps}>
      <Box className="DatabaseActivity-header">
        <Typography variant="overline">Database Explorer</Typography>
      </Box>
      {hasConnections ? (
        <>
          <ConnectionPicker connection={props.connection} connections={props.connections} onCommand={props.onCommand} />
          <DatabaseTreeView connection={props.connection} onCommand={props.onCommand} />
        </>
      ) : (
        renderEmpty()
      )}
    </Box>
  )
}
