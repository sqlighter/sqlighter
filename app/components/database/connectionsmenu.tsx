//
// connectionsmenu.tsx - shows list of available connections, selects current connection, opens connections manager panel
//

import { useState } from "react"
import { SxProps, Theme } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"

import { CommandEvent } from "../../lib/commands"
import { DataConnection } from "../../lib/sqltr/connections"
import { Icon } from "../ui/icon"
import { Label } from "../ui/typography"
import { Tooltip } from "../ui/tooltip"

const connectionsMenu_sx: SxProps<Theme> = {
  maxWidth: 1,
  display: "flex",
  flexWrap: "nowrap",
  alignItems: "center",

  ".ConnectionPicker-icon": {
    //
  },

  ".ConnectionPicker-label": {
    marginLeft: 1,
    flexShrink: 1,

    minWidth: 80,
    maxWidth: 160,

    ".MuiTypography-root": {
      width: 1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      wordWrap: "break-word",
      textOverflow: "ellipsis",
    },
  },
}

//
// connectionicon - shows icon for database type plus dot with status
//

export interface ConnectionIconProps {
  connection?: DataConnection
}

export function ConnectionIcon(props: ConnectionIconProps) {
  if (props.connection) {
    // TODO show dot based on current connection status, eg. database ready, busy, disconnected
    return (
      <Icon className="ConnectionPicker-icon" dotColor="success">
        {props.connection.configs.client}
      </Icon>
    )
  }
}

//
// connectionpicker - shows the current connection status and name with a connection menu
//

export interface ConnectionPickerProps {
  /** Currently selected connection */
  connection?: DataConnection

  /** All available connections */
  connections?: DataConnection[]

  /** Callback used to dispatch commands back to parent component */
  onCommand?: CommandEvent
}

export function ConnectionPicker(props: ConnectionPickerProps) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  //
  // handlers
  //

  function handleOpenClick(e) {
    if (props.onCommand) {
      props.onCommand(e, { command: "sqlighter.manageConnections" })
    }
  }

  function handleClick(event) {
    console.debug(`ConnectionPicker.handleClick`)
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  //
  // render
  //

  function renderMenuItems() {
    return (
      <>
        <Box sx={{ ml: 2, mr: 1, mb: 2, mt: 1 }}>
          <TextField id="filter" size="small" placeholder="Filter connections" variant="outlined" sx={{ mr: 1 }} />
          <Button variant="outlined" sx={{ minWidth: 40, width: 40, height: 40 }}>
            <Icon>add</Icon>
          </Button>
        </Box>
        <Divider />
        {props.connections.map((conn) => {
          return (
            <MenuItem key={conn.id} onClick={handleClose}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ mr: 1 }}>
                  <ConnectionIcon connection={conn} />
                </Box>
                <Box>{conn.title}</Box>
              </Box>
            </MenuItem>
          )
        })}
        <Divider />
        <MenuItem onClick={handleClose}>Manage connections</MenuItem>
      </>
    )
  }

  if (!props.connection) {
    return (
      <Button variant="outlined" onClick={handleOpenClick}>
        Open Demo
      </Button>
    )
  }

  console.debug("connection2", props.connection)

  const title = props.connection.title || props.connection.id

  const tooltip = (
    <>
      <Box>Connection</Box>
      <Box>{title}</Box>
    </>
  )

  return (
    <Box>
      <Tooltip title={tooltip}>
        <Button onClick={handleClick} color="inherit">
          <Box className="ConnectionPicker-root" sx={connectionsMenu_sx}>
            <ConnectionIcon connection={props.connection} />
            <Box className="ConnectionPicker-label">
              <Label>{title}</Label>
            </Box>
            <Icon className="ConnectionPicker-expandIcon">expand</Icon>
          </Box>
        </Button>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {renderMenuItems()}
      </Menu>
    </Box>
  )
}
