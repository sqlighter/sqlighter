/**
 * iconbutton.tsx - customized icon button used to dispatch commands
 */

import * as React from "react"
import { SxProps, Theme, ToggleButtonProps as MuiToggleButtonProps } from "@mui/material"
import MuiIconButton from "@mui/material/IconButton"
import Box from "@mui/material/Box"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import MuiToggleButton from "@mui/material/ToggleButton"

import { Command, CommandEvent } from "../../lib/commands"
import { Icon } from "./icon"

const ToggleCommandButton_SxProps: SxProps<Theme> = {

}

/** Shows command as an icon button raising an onCommand event when clicked */
export interface ToggleCommandButtonProps extends MuiToggleButtonProps {
  /** Command to be rendered by this button */
  command: Command

  /** True if button's title should be shown next to icon (default false) */
  label?: boolean

  /** Command handler for button click */
  onCommand?: CommandEvent
}

/** A customized icon button that raises onCommand events */
export function ToggleCommandButton(props: ToggleCommandButtonProps) {
  const { command, label, onCommand, ...buttonProps } = props
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
  /*
  let button = (
    <Box className="IconButton-root" sx={IconButton_SxProps}>
      <MuiIconButton
        className={props.selected ? "IconButton-button IconButton-selected Mui-selected" : "IconButton-button"}
        onClick={handleClick}
        {...buttonProps}
      >
        <Icon className="IconButton-icon" fontSize="inherit">
          {command.icon}
        </Icon>
        {props.label && (
          <Typography className="IconButton-label" variant="body2" sx={{ ml: 0.5 }}>
            {props.command.title}
          </Typography>
        )}
      </MuiIconButton>
    </Box>
  )

  // Optional tooltip if title is defined
  if (props.command.title && !props.label) {
    button = (
      <Tooltip className="IconButton-tooltip" title={command.title}>
        {button}
      </Tooltip>
    )
  }
  return button
*/
  return (
    <MuiToggleButton className="ToggleButton-root" {...buttonProps} onClick={handleClick} value={command.command} sx={ToggleCommandButton_SxProps}>
      <Icon>{command.icon}</Icon> {props.label && props.title}
    </MuiToggleButton>
  )
}
