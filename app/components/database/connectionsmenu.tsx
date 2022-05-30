//
// connectionsmenu.tsx - shows list of available connections, selects current connection, opens connections manager panel
//

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

import { CommandEvent } from "../../lib/commands"
import { DataConnection } from "../../lib/sqltr/connections"

export interface ConnectionsMenuProps {
  /** Currently selected connection */
  connection?: DataConnection

  /** All available connections */
  connections?: DataConnection[]

  /** Callback used to dispatch commands back to parent component */
  onCommand?: CommandEvent
}

export function ConnectionsMenu(props: ConnectionsMenuProps) {
  //
  // handlers
  //

  function handleOpenClick(e) {
    if (props.onCommand) {
      props.onCommand(e, { command: "sqlighter.manageConnections" })
    }
  }

  //
  // render
  //

  if (!props.connection) {
    return (
      <Button variant="outlined" onClick={handleOpenClick}>
        Open Demo
      </Button>
    )
  }

  return <Box sx={{ maxHeight: 24 }}>ConnectionsMenu/TBD</Box>
}
