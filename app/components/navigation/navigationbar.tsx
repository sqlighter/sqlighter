/**
 * navigationbar.tsx - navigation bar composed of icon buttons possibly with a selected state
 */

import * as React from "react"
import Stack from "@mui/material/Stack"
import { Command, CommandEvent } from "../../lib/commands"
import { IconButton } from "../ui/iconbutton"

export interface NavigationBarProps {
  /** Commands rendered in this navigation bar */
  commands: Command[]

  /** Command that should be selected (optional) */
  selected?: string

  /** True if buttons titles should be shown next to icon (default false) */
  label?: boolean

  /** Command handler for button clicks */
  onCommand?: CommandEvent
}

/** A navigation bar with icon buttons styled a la material design 3 */
export function NavigationBar(props: NavigationBarProps) {
  return (
    <Stack direction="row">
      {props.commands.map((cmd) => {
        const selected = props.selected && cmd.command === props.selected
        return <IconButton command={cmd} label={props.label} selected={selected} onCommand={props.onCommand} />
      })}
    </Stack>
  )
}
