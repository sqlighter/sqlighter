//
// connectionspicker.tsx - shows list of available connections, selects current connection, opens connections manager panel
//

import { useState } from "react"
import { SxProps, Theme } from "@mui/material"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import { CommandEvent } from "../../lib/commands"
import { DataConnection } from "../../lib/sqltr/connections"
import { Icon } from "../ui/icon"
import { ConnectionIcon } from "./connectionicon"

export const CONNECTIONPICKER_MIN_WIDTH = 140
export const CONNECTIONPICKER_MAX_WIDTH = 240

// styles for connections picker and subcomponents
const ConnectionPicker_Sx: SxProps<Theme> = {
  maxWidth: CONNECTIONPICKER_MAX_WIDTH,
  height: 36,

  ".ConnectionPicker-button": {
    maxWidth: CONNECTIONPICKER_MAX_WIDTH,
    height: 36,
  },

  ".ConnectionPicker-icon": {
    //
  },

  ".ConnectionPicker-label": {
    marginLeft: 1,
    flexShrink: 1,
    textAlign: "start",

    minWidth: 40,
    maxWidth: 240,

    ".MuiTypography-root": {
      width: 1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      wordWrap: "break-word",
      textOverflow: "ellipsis",
    },
  },

  // TODO add a space between button and menu
  "& .MuiModal-root": {
    marginTop: "8px", // or 1
  },
}

export interface ConnectionPickerProps {
  /** Currently selected connection */
  connection?: DataConnection

  /** All available connections */
  connections?: DataConnection[]

  /** Callback used to dispatch commands back to parent component */
  onCommand?: CommandEvent
}

/** Shows the current connection status and name plus a menu to pick a different connection */
export function ConnectionPicker(props: ConnectionPickerProps) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  // connection's menu filter
  const [filter, setFilter] = useState<string>("")

  //
  // handlers
  //

  // open the menu
  function handleClick(event) {
    setAnchorEl(event.currentTarget)
  }

  // user typing in the menu's filter
  function handleFilterChange(event) {
    event.stopPropagation()
    const value = event.target.value
    setFilter(value)
  }

  function handleCloseMenu(event) {
    setAnchorEl(null)
  }

  // user picked a connection from the menu
  function handleSelectConnection(event, connection) {
    handleCloseMenu(event)
    if (props.onCommand) {
      props.onCommand(event, {
        command: "changeConnection",
        args: {
          item: connection,
        },
      })
    }
  }

  // user clicked plus button to create a connection
  function handleCreateConnection(event) {
    handleCloseMenu(event)
    if (props.onCommand) {
      props.onCommand(event, { command: "createConnection" })
    }
  }

  // user clicked plus button or manage connections menu item
  function handleManageConnections(event) {
    handleCloseMenu(event)
    if (props.onCommand) {
      props.onCommand(event, { command: "manageConnections" })
    }
  }

  //
  // render
  //

  function renderMenu() {
    let menuConnections = props.connections
    if (filter.length > 0) {
      menuConnections = menuConnections.filter(
        (conn) => conn.title && conn.title.toLowerCase().indexOf(filter.toLowerCase()) != -1
      )
    }

    return (
      <Menu
        id="connection-picker-menu"
        className="ConnectionPicker-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "connection-button",
        }}
      >
        <Box sx={{ ml: 2, mr: 2, mb: 2, mt: 1 }} onKeyDown={(e) => e.stopPropagation()}>
          <TextField
            id="connection-picker-filter"
            className="ConnectionPicker-filter"
            size="small"
            placeholder="Filter connections"
            variant="outlined"
            autoComplete="off"
            value={filter}
            onChange={handleFilterChange}
            autoFocus
            sx={{ mr: 1 }}
          />
          <Tooltip title="Create connection">
            <Button variant="outlined" onClick={handleCreateConnection} sx={{ minWidth: 40, width: 40, height: 40 }}>
              <Icon>add</Icon>
            </Button>
          </Tooltip>
        </Box>
        <Divider sx={{ mb: 1 }} />
        {menuConnections.map((conn) => {
          return (
            <MenuItem key={conn.id} onClick={(e) => handleSelectConnection(e, conn)}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ mr: 1 }}>
                  <ConnectionIcon connection={conn} />
                </Box>
                <Box>{conn.title}</Box>
              </Box>
            </MenuItem>
          )
        })}
        {menuConnections.length > 0 && <Divider />}
        <MenuItem className="ConnectionPicker-manageConnections" onClick={handleManageConnections}>
          Manage connections
        </MenuItem>
      </Menu>
    )
  }

  // TODO more gracious empty state for connection picker
  if (!props.connection) {
    return (
      <Button variant="outlined" onClick={handleManageConnections}>
        Open Demo
      </Button>
    )
  }

  // fallback on connection's id if title is missing
  const title = props.connection.title || props.connection.id
  const tooltipTitle = (
    <>
      <Box>Connection:</Box>
      <Box>{title}</Box>
    </>
  )

  return (
    <Box className="ConnectionPicker-root" sx={ConnectionPicker_Sx}>
      <Tooltip title={tooltipTitle}>
        <Button
          className="ConnectionPicker-button"
          id="connection-picker-button"
          onClick={handleClick}
          variant="text"
        >
          <ConnectionIcon connection={props.connection} />
          <Typography className="ConnectionPicker-label" variant="button" noWrap>
            {title}
          </Typography>
          <Icon className="ConnectionPicker-expandIcon">expand</Icon>
        </Button>
      </Tooltip>
      {renderMenu()}
    </Box>
  )
}
