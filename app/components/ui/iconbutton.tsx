/**
 * iconbutton.tsx - customized icon button used to dispatch commands
 */

import * as React from "react"
import { IconButtonProps as MuiIconButtonProps, SxProps, Theme } from "@mui/material"
import MuiIconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import { Command, CommandEvent } from "../../lib/commands"
import { Icon } from "./icon"

const IconButton_SxProps: SxProps<Theme> = {
  borderRadius: "8px",
  "&:hover": {
    borderRadius: "8px",
  },
  "&.Mui-selected": {
    color: "primary.main",
    backgroundColor: "primary.light",
  },
}

/** Shows command as an icon button raising an onCommand event when clicked */
export interface IconButtonProps extends MuiIconButtonProps {
  /** Command to be rendered by this button */
  command: Command

  /** True if button's title should be shown next to icon (default false) */
  label?: boolean

  /** True if button should be selected/higlighted */
  selected?: boolean

  /** Command handler for button click */
  onCommand?: CommandEvent
}

/** A customized icon button that raises onCommand events */
export function IconButton(props: IconButtonProps) {
  //
  // state
  //

  const { className, command, label, selected, onCommand, ...buttonProps } = props
  if (!command.icon) {
    console.error(`IconButton - command.icon missing`, command)
  }

  //
  // handlers
  //

  function handleClick(event) {
    event.preventDefault()
    event.stopPropagation()

    switch (command.command) {
      case "openUrl":
        console.debug(`IconButton.handleClick - link: ${command.args.href}`)
        window.open(command.args.href, command.args.target || '_blank');
        return
    }

    if (onCommand) {
      onCommand(event, command)
    }
  }

  //
  // render
  //

  let button = (
    <MuiIconButton
      className={`IconButton-root ${props.selected ? " Mui-selected" : ""} ${className}`}
      role="button"
      onClick={handleClick}
      sx={IconButton_SxProps}
      color={command.args?.color}
      {...buttonProps}
    >
      <Icon className="IconButton-icon" fontSize="inherit">
        {command.icon}
      </Icon>
      {(props.label || command.args?.label) && (
        <Typography className="IconButton-label" variant="body2" sx={{ ml: 0.5 }}>
          {props.command.title}
        </Typography>
      )}
    </MuiIconButton>
  )

  // Optional tooltip if title is defined
  if (props.command.title && !props.label) {
    button = (
      <Tooltip className="IconButton-tooltip" title={command.description || command.title}>
        {button}
      </Tooltip>
    )
  }
  return button
}
