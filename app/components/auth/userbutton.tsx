//
// UserButton.tsx - shows user avatar and a menu with signout and other options
//

import { useState } from "react"
import { SxProps, Theme } from "@mui/material"

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"

import { User } from "../../lib/items/users"
import { CommandEvent } from "../../lib/commands"
import { IconButton } from "../ui/iconbutton"

const UserButton_Sx: SxProps<Theme> = {
  ".UserButton-avatar": {
    width: 24,
    height: 24,
  },
}

const UserButtonMenu_Sx: SxProps<Theme> = {
  maxWidth: 300,
  ".UserButtonMenu-header": {
    ml: 2,
    mr: 2,
    mb: 1,
    mt: 1,
  },
  ".UserButtonMenu-avatar": {
    width: 48,
    height: 48,
    marginBottom: 0.5,
  },
  ".UserButtonMenu-name": {
    cursor: "default",
    position: "relative",
    top: "4px",

    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  ".UserButtonMenu-email": {
    cursor: "default",
    color: "text.secondary",

    maxWidth: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}

export interface UserButtonProps {
  /** Class name that should be given to this component */
  className?: string

  /** Currently logged in user */
  user?: User

  /** Callback used to dispatch commands back to parent component */
  onCommand?: CommandEvent
}

/** A button with user's avatar showing a menu with a signout command and other options */
export function UserButton(props: UserButtonProps) {
  //
  // state
  //

  const displayName = props.user?.getDisplayName()
  const profileImage = props.user?.getProfileImageUrl()
  const email = props.user?.getEmail()

  // menu state
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  //
  // handlers
  //

  function handleSignout(event) {
    // close menu
    setAnchorEl(null)
    if (props.onCommand) {
      props.onCommand(event, { command: "signout", args: { user: props.user } })
    }
  }

  //
  // render
  //

  function renderMenu() {
    // TODO sometimes avatar image doesn't load, could use referrerpolicy="no-referrer"?
    return (
      <Menu
        className="UserButtonMenu-root"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        sx={UserButtonMenu_Sx}
      >
        <Box className="UserButtonMenu-header" onKeyDown={(e) => e.stopPropagation()}>
          <Avatar className="UserButtonMenu-avatar" alt={displayName} src={profileImage} />
          <Typography className="UserButtonMenu-name" variant="body1">
            {displayName}
          </Typography>
          <Typography className="UserButtonMenu-email" variant="body2">
            {email}
          </Typography>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <MenuItem onClick={handleSignout}>Sign out</MenuItem>
      </Menu>
    )
  }

  const className = "UserButton-root" + (props.className ? ` ${props.className}` : "")
  if (!props.user) {
    return (
      <IconButton
        className={className}
        onCommand={props.onCommand}
        command={{
          command: "signin",
          icon: "account",
          title: "Sign in",
        }}
      />
    )
  }

  return (
    <>
      <IconButton
        className={className}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        command={{
          command: "openMenu",
          icon: <Avatar className="UserButton-avatar" alt={displayName} src={profileImage} />,
          title: (
            <>
              {displayName}
              <br />
              {email}
            </>
          ),
        }}
        sx={UserButton_Sx}
      />
      {renderMenu()}
    </>
  )
}
