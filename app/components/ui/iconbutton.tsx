/**
 * iconbutton.tsx - customized icon button used to dispatch commands
 */

import * as React from "react"
import { IconButtonProps as MuiIconButtonProps, IconButton as MuiIconButton, SxProps, Theme } from "@mui/material"

import { Command, CommandEvent } from "../../lib/commands"
import { Icon } from "./icon"
import { Tooltip } from "./tooltip"

// https://storybook.js.org/docs/react/writing-tests/test-runner

//
// CommandIconButton
//

const CommandIconButton_SxProps: SxProps<Theme> = {
  borderRadius: "8px",
}

/** Shows command as an icon button raising an onCommand event when clicked */
export interface IconButtonProps extends MuiIconButtonProps {
  /** Command to be rendered by this button */
  command: Command
  /** Command handler for button click */
  onCommand?: CommandEvent
}

export function IconButton(props: IconButtonProps) {
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
    <MuiIconButton
      className="IconButton-root"
      {...buttonProps}
      onClick={handleClick}
      sx={CommandIconButton_SxProps}
    >
      <Icon fontSize="inherit">{command.icon}</Icon> pippo
    </MuiIconButton>
  )

  // optional tooltip if title is defined
  if (props.command.title) {
    button = <Tooltip title={command.title}>{button}</Tooltip>
  }

  return button
}
