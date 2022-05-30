/**
 * commands.tsx - Data model for commands passed between different components of the app and its extensions
 */

import * as React from "react"
import { IconButtonProps, IconButton, SxProps, Theme } from "@mui/material"

import { Icon } from "./ui/icon"
import { Tooltip } from "./ui/tooltip"

/** A single command shown for example as an icon, in a contextual menu, etc. */
export interface Command {
  /** A unique string for this command, eg: sqlighter.expandAll (prefix.command) */
  command: string

  /** Icon name or actual icon node for the command (optional) */
  icon?: string | React.ReactNode

  /** A human-readable string describing this command (used as tooltip for icon buttons) */
  title?: string

  /** Arguments passed to this command (optional and command-specific) */
  args?: { [key: string]: any }
}

/** Callback used to propagate commands within the application */
export type CommandEvent<T = Command> = (event: React.SyntheticEvent, command: T) => void

//
// CommandIconButton
//

const CommandIconButton_SxProps: SxProps<Theme> = {
  borderRadius: "8px",
}

/** Shows command as an icon button raising an onCommand event when clicked */
export interface CommandIconButtonProps extends IconButtonProps {
  /** Command to be rendered by this button */
  command: Command
  /** Command handler for button click */
  onCommand?: CommandEvent
}

export function CommandIconButton(props: CommandIconButtonProps) {
  const { command, onCommand, ...buttonProps } = props
  if (!command.icon) {
    console.error(`CommandIconButton - command.icon missing`, command)
  }

  function handleClick(event) {
    if (onCommand) {
      onCommand(event, command)
    }
  }

  //
  // render
  //

  let button = (
    <IconButton
      className="CommandIconButton-root"
      {...buttonProps}
      onClick={handleClick}
      sx={CommandIconButton_SxProps}
    >
      <Icon fontSize="inherit">{command.icon}</Icon>
    </IconButton>
  )

  // optional tooltip if title is defined
  if (props.command.title) {
    button = <Tooltip title={command.title}>{button}</Tooltip>
  }

  return button
}
