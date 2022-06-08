/**
 * iconbutton.tsx - customized icon button used to dispatch commands
 */

import * as React from "react"
import { IconButtonProps as MuiIconButtonProps, SxProps, Theme } from "@mui/material"
import MuiIconButton from "@mui/material/IconButton"
import Box from "@mui/material/Box"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import { Command, CommandEvent } from "../../lib/commands"
import { Icon } from "./icon"

const IconButton_SxProps: SxProps<Theme> = {
  ".IconButton-button": {
    borderRadius: "8px",

    "&:hover": {
      borderRadius: "8px",
    },
  },

  ".IconButton-selected": {
    color: "primary.main",
    backgroundColor: "primary.light",
    //    backgroundColor: (theme: Theme | any) => theme.palette.materialyou.primary.light,
  },
}

/** Shows command as an icon button raising an onCommand event when clicked */
export interface IconButtonProps extends MuiIconButtonProps {
  /** Class to be applied to this component */
  className?: string

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
    <Box className={`IconButton-root ${props.className}`} sx={IconButton_SxProps}>
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
}
