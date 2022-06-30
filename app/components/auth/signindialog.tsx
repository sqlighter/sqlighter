/**
 * signindialog.tsx
 */

import React from "react"
import { SxProps, Theme } from "@mui/material"
import Box from "@mui/material/Box"
import Backdrop from "@mui/material/Backdrop"
import Typography from "@mui/material/Typography"

import { CommandEvent } from "../../lib/commands"
import { Icon } from "../ui/icon"
import { IconButton } from "../ui/iconbutton"
import { GoogleSigninButton } from "./googlesigninbutton"

const SigninDialog_SxProps: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",

  backgroundColor: "background.default",
  zIndex: (theme) => theme.zIndex.drawer + 1,

  ".SigninDialog-icon": {
    fontSize: 80,
    color: "text.primary",
  },
  ".SigninDialog-title": {
    fontWeight: "bold",
    color: "text.primary",
    marginTop: 2,
  },
  ".SigninDialog-description": {
    color: "text.secondary",
    marginBottom: 2,
  },
  ".SigninButton-buttonBox": {
    width: 300,
    height: 200,
    display: "flex",
    justifyContent: "center",
  },
}

export interface SigninDialogProps {
  /** Used to send back close command */
  onCommand?: CommandEvent
}

/** A fullpage panel showing signin options */
export function SigninDialog(props: SigninDialogProps) {
  const closeCommand = {
    command: "closeDialog",
    title: "Close",
    icon: "close",
    args: {
      onCommand: undefined
    },
  }

  function handleCommand(event, command) {
    // console.debug(`SigninDialog.handleCommand: ${command.command}`, command)
    console.assert(props.onCommand, "SigninDialog.handleCommand: missing onCommand")
    if (props.onCommand) {
      props.onCommand(event, command)
    }
  }

  return (
    <Backdrop
      className="SigninDialog-root"
      open={true}
      onClick={(event) => handleCommand(event, closeCommand)}
      sx={SigninDialog_SxProps}
    >
      <Icon className="SigninDialog-icon">sqlighter</Icon>
      <Typography className="SigninDialog-title" variant="h3">
        Welcome
      </Typography>
      <Typography className="SigninDialog-description" variant="body2">
        Sign in to access your data, bookmarks, etc.
      </Typography>
      <Box className="SigninButton-buttonBox">
        <GoogleSigninButton size="large" shape="pill" />
      </Box>
      <IconButton command={closeCommand} onCommand={(e) => handleCommand(e, closeCommand)} size="small" />
    </Backdrop>
  )
}
