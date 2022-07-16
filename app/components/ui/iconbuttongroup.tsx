/**
 * iconbuttongroup.tsx - group of icon buttons used to dispatch commands
 */

import * as React from "react"
import { SxProps, Theme } from "@mui/material"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"

import { Command, CommandEvent } from "../../lib/commands"
import { IconButton } from "./iconbutton"

const IconButtonGroup_SxProps: SxProps<Theme> = {
  ".IconButtonGroup-divider": {
    marginLeft: "4px",
    marginRight: "3px", // 1px for the divider itself
  },
}

interface IconRendering {
  /** True if label should be shown */
  label?: boolean
}

/** A list of commands shown as icons with optional spacing and group dividers */
export type IconButtonGroupCommands = (Command | "divider" | "spacing")[]

export interface IconButtonGroupProps {
  /** Class to be applied to this component */
  className?: string

  /** Commands to be rendered by this button, add "divider" to space them out */
  commands: IconButtonGroupCommands

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

  const className = "IconButtonGroup-root" + (props.className ? " " + props.className : "")
  return (
    <Stack className={className} direction="row" sx={IconButtonGroup_SxProps}>
      {props.commands &&
        props.commands.map((command, index) => {
          if (command === "spacing") {
            return <Box key={index} className="IconButtonGroup-spacing" sx={{ marginRight: 1 }} />
          }
          if (command === "divider") {
            return (
              <Divider
                key={index}
                className="IconButtonGroup-divider"
                orientation="vertical"
                variant="middle"
                flexItem
              />
            )
          }
          return (
            <IconButton
              key={index}
              command={command}
              selected={props.selected == command.command}
              size={props.size || "medium"}
              label={command?.args?.label}
              onCommand={props.onCommand}
            />
          )
        })}
    </Stack>
  )
}
