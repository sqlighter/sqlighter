/**
 * iconbuttongroup.tsx - group of icon buttons used to dispatch commands
 */

import * as React from "react"
import { IconButtonProps as MuiIconButtonProps, SxProps, Theme } from "@mui/material"
import MuiIconButton from "@mui/material/IconButton"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"

import { Command, CommandEvent } from "../../lib/commands"
import { Icon } from "./icon"
import { IconButton } from "./iconbutton"

const IconButtonGroup_SxProps: SxProps<Theme> = {
  ".IconButtonGroup-divider": {
    marginLeft: "4px",
    marginRight: "3px", // 1px for the divider itself
  },
}

export interface IconButtonGroupProps {
  /** Class to be applied to this component */
  className?: string

  /** Commands to be rendered by this button, add "divider" to space them out */
  commands: (Command | "divider" | "spacing")[]

  /**
   * True if button's title should be shown next to icon
   * @default false
   */
  label?: boolean

  /**
   * If specified then the icon with the given command is selected and the group acts as a toggle group
   * @default null
   */
  selected?: string

  /**
   * The size of the component. `small` is equivalent to the dense button styling.
   * @default 'medium'
   */
  size?: "small" | "medium" | "large"

  /** Command handler for button click */
  onCommand?: CommandEvent
}

/** A group of icons that act like independent buttons or as a toggle group */
export function IconButtonGroup(props: IconButtonGroupProps) {
  //
  // render
  //

  return (
    <Stack className={`IconButtonGroup-root ${props.className}`} direction="row" sx={IconButtonGroup_SxProps}>
      {props.commands &&
        props.commands.map((command, index) => {
          if (command === "spacing") {
            return <Box className="IconButtonGroup-spacing" sx={{ marginRight: 1 }} />
          }
          if (command === "divider") {
            return (
              <Divider
                className="IconButtonGroup-divider"
                key={index}
                orientation="vertical"
                variant="middle"
                flexItem
              />
            )
          }
          return (
            <IconButton
              key={command.command}
              command={command}
              selected={props.selected == command.command}
              size={props.size || "medium"}
              label={props.label}
              onCommand={props.onCommand}
            />
          )
        })}
    </Stack>
  )
}
