//
// connectionsmenu.tsx - shows list of available connections, selects current connection, opens connections manager panel
//

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

export interface ConnectionsMenuProps {
  /** Currently selected connection */
  connection?: any

  /** All available connections */
  connections?: any[]

  /** Callback used to dispatch commands back to parent component */
  onCommand?: (event: React.SyntheticEvent, command: string, args?) => void
}

export function ConnectionsMenu({ connection, connections, onCommand }: ConnectionsMenuProps) {
  //
  // handlers
  //

  function handleOpenClick(e) {
    if (onCommand) {
      onCommand(e, "sqlighter.manageConnections")
    }
  }

  //
  // render
  //

  if (!connection) {
    return (
      <Button variant="outlined" onClick={handleOpenClick}>
        Open Demo
      </Button>
    )
  }

  return <Box sx={{maxHeight: 24}}>ConnectionsMenu/TBD</Box>
}
