/**
 * iconbutton.tsx - customized icon button used to dispatch commands
 */

import * as React from "react"
import {
  Box,
  IconButtonProps as MuiIconButtonProps,
  IconButton as MuiIconButton,
  SxProps,
  Theme,
  Typography,
} from "@mui/material"

import { Command, CommandEvent } from "../../lib/commands"
import { Icon } from "./icon"
import { Tooltip } from "./tooltip"


const IconButton_SxProps: SxProps<Theme> = {
  borderRadius: "8px",
}

/** Shows command as an icon button raising an onCommand event when clicked */
export interface IconButtonProps extends MuiIconButtonProps {
  /** Command to be rendered by this button */
  command: Command

  /** True if button's title should be shown next to icon (default false) */
  label?: boolean

  /** Command handler for button click */
  onCommand?: CommandEvent
}

/** A customized icon button that raises onCommand events */
export function IconButton(props: IconButtonProps) {
  const { command, onCommand, ...buttonProps } = props
  if (!command.icon) {
    console.error(`IconButton - command.icon missing`, command)
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
    <Box className="IconButton-root">
      <MuiIconButton className="IconButton-button" {...buttonProps} onClick={handleClick} sx={IconButton_SxProps}>
        <Icon className="IconButton-icon" fontSize="inherit">
          {command.icon}
        </Icon>
        {props.label && (
          <Typography className="IconButton-label" variant="button" sx={{ ml: 0.5 }}>
            {props.command.title}
          </Typography>
        )}
      </MuiIconButton>
    </Box>
  )

  // optional tooltip if title is defined
  if (props.command.title && !props.label) {
    button = <Tooltip title={command.title}>{button}</Tooltip>
  }
  return button
}
