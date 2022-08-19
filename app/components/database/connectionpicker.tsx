//
// connectionspicker.tsx - shows list of available connections, selects current connection, opens connections manager panel
//

import { useState, ReactElement } from "react"
import { SxProps, Theme } from "@mui/material"

import Box from "@mui/material/Box"
import ButtonGroup from "@mui/material/ButtonGroup"
import Button, { ButtonProps } from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import { CommandEvent } from "../../lib/commands"
import { DataConnection } from "../../lib/data/connections"
import { Icon } from "../ui/icon"
import { ConnectionIcon } from "./connectionicon"
import { IconButton } from "../ui/iconbutton"

export const CONNECTIONPICKER_MIN_WIDTH = 140
export const CONNECTIONPICKER_MAX_WIDTH = 240

// styles for connections picker and subcomponents
const ConnectionPicker_Sx: SxProps<Theme> = {
  ".ConnectionPicker-button": {
    maxWidth: CONNECTIONPICKER_MAX_WIDTH,
    //  height: 36,
  },

  ".ConnectionPicker-icon": {
    //
  },

  ".ConnectionPicker-label": {
    marginLeft: 1,
    flexShrink: 1,
    textAlign: "start",

    minWidth: 20,
    maxWidth: 240,

    ".MuiTypography-root": {
      width: 1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      wordWrap: "break-word",
      textOverflow: "ellipsis",
    },
  },

  ".ConnectionPicker-add": {
    minWidth: 40,
    width: 40,
    height: 40,
  },

  ".ConnectionPicker-check": {
    minWidth: 24,
    width: 24,
    height: 24,
  },

  ".ConnectionPicker-connectionIcon": {
    marginRight: 1,
  },

  // TODO add a space between button and menu
  "& .MuiModal-root": {
    marginTop: "8px", // or 1
  },

  // button labels should not wrap
  ".MuiButton-root": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}

const ConnectionPickerMenu_Sx: SxProps<Theme> = {
  ".ConnectionPickerMenu-add": {
    minWidth: 40,
    width: 40,
    height: 40,
  },

  ".ConnectionPickerMenu-check": {
    minWidth: 24,
    width: 24,
    height: 24,
  },

  ".ConnectionPickerMenu-connectionIcon": {
    marginRight: 1,
  },

  // TODO add a space between button and menu
  "& .MuiModal-root": {
    marginTop: "8px", // or 1
  },

  // button labels should not wrap
  ".MuiButton-root": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}

export interface ConnectionPickerProps {
  /** Currently selected connection */
  connection?: DataConnection

  /** All available connections */
  connections?: DataConnection[]

  /** Callback used to dispatch commands back to parent component */
  onCommand?: CommandEvent

  /** Regular or smaller */
  variant?: "default" | "compact"

  /** Variant passed to button for styling */
  buttonVariant?: "contained" | "outlined" | "text"

  /** Button can be grouped with other buttons passed as children */
  children?: ReactElement

  /** Props that should be passed to button */
  buttonProps?: ButtonProps
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
        command: "setConnection",
        args: {
          connection,
        },
      })
    }
  }

  /** Clicked on 'Manage connections' */
  function handleManageConnections(event) {
    handleCloseMenu(event)
    if (props.onCommand) {
      props.onCommand(event, { command: "openHome" })
    }
  }

  function handleOpenFile(event) {
    handleCloseMenu(event)
    if (props.onCommand) {
      props.onCommand(event, { command: "openFile" })
    }
  }

  //
  // render
  //

  function renderMenu() {
    let menuConnections = props.connections
    if (filter.length > 0) {
      menuConnections = [...menuConnections].filter(
        (conn) => conn.title && conn.title.toLowerCase().indexOf(filter.toLowerCase()) != -1
      )
      menuConnections = menuConnections.sort((a, b) => (a.title < b.title ? -1 : 1))
    }

    return (
      <Menu
        id="connection-picker-menu"
        className="ConnectionPickerMenu-root"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        sx={ConnectionPickerMenu_Sx}
        MenuListProps={{
          "aria-labelledby": "connection-button",
        }}
      >
        <Box sx={{ ml: 2, mr: 2, mb: 2, mt: 1 }} onKeyDown={(e) => e.stopPropagation()}>
          <TextField
            id="connection-picker-filter"
            className="ConnectionPickerMenu-filter"
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
            <Button className="ConnectionPickerMenu-add" variant="outlined" onClick={handleOpenFile}>
              <Icon>add</Icon>
            </Button>
          </Tooltip>
        </Box>
        <Divider sx={{ mb: 1 }} />
        {menuConnections.map((conn) => {
          return (
            <MenuItem key={conn.id} onClick={(e) => handleSelectConnection(e, conn)}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box className="ConnectionPickerMenu-checkbox" sx={{ width: 20 }}>
                  {props.connection.id == conn.id && (
                    <Icon
                      fontSize="small"
                      sx={{ verticalAlign: "middle", position: "relative", left: "-4px", paddingRight: 0 }}
                    >
                      check
                    </Icon>
                  )}
                </Box>
                <ConnectionIcon className="ConnectionPickerMenu-connectionIcon" connection={conn} />
                <Box sx={{ ml: 1 }}>{conn.title}</Box>
              </Box>
            </MenuItem>
          )
        })}
        {menuConnections.length > 0 && <Divider />}
        <MenuItem className="ConnectionPickerMenu-manageConnections" onClick={handleManageConnections}>
          Manage connections
        </MenuItem>
      </Menu>
    )
  }

  // empty state for connection picker
  if (!props.connection) {
    return (
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
      <ButtonGroup variant={props.buttonVariant || "text"}>
        {props.children}
        <Tooltip title={tooltipTitle}>
          <Button
            {...props.buttonProps}
            className="ConnectionPicker-button"
            id="connection-picker-button"
            onClick={handleClick}
            variant={props.buttonVariant || "text"}
          >
            <ConnectionIcon connection={props.connection} />
            {props.variant != "compact" && (
              <Typography className="ConnectionPicker-label" variant="button" noWrap>
                {title}
              </Typography>
            )}
            <Icon className="ConnectionPicker-expandIcon">expand</Icon>
          </Button>
        </Tooltip>
      </ButtonGroup>
      {renderMenu()}
    </Box>
  )
}
