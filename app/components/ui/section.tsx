//
// section.tsx - a section of content with title and optional desription, commands, action, contents
//

import { ReactElement } from "react"
import { SxProps, Theme } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import { PanelProps } from "../navigation/panel"
import { Command, CommandEvent } from "../../lib/commands"
import { IconButtonGroup } from "./iconbuttongroup"

const Section_SxProps: SxProps<Theme> = {
  width: 1,
  display: "flex",
  flexDirection: "column",

  // optical aligment for larger title
  ".Section-largeTitle": {
    position: "relative",
    left: "-2px",
  },

  ".Section-action": {
    height: 40,
    minWidth: 80,
  },

  ".Section-commands": {
    paddingTop: 2,
    marginLeft: -1,
  },

  ".Section-children": {
    paddingTop: 1,
    flexGrow: 1,
  },
}

export interface SectionProps extends PanelProps {
  /** Class name applied to this component */
  className?: string

  /** Section title */
  title: string | any

  /** Section subtitle (optional) */
  description?: string | any

  /** Commands icons below section header, add "spacing" or "divider" to space them out */
  commands?: (Command | "divider" | "spacing")[]

  /** Large action command shown to the right of section's title */
  action?: Command

  /** Larger title? Default regular */
  variant?: "default" | "large"

  /** Section contents */
  children: ReactElement | ReactElement[]

  /** Callback used by this panel to dispatch commands back to parent components */
  onCommand?: CommandEvent
}

/** A content section with standardized style and structure */
export function Section(props: SectionProps) {
  //
  // render
  //

  function renderAction() {
    if (props.action) {
      const actionCmd = props.action as Command
      let button = (
        <Button className="Section-action" variant="text" onClick={(e) => props.onCommand(e, actionCmd)}>
          {actionCmd.title}
        </Button>
      )
      if (actionCmd.description) {
        button = <Tooltip title={actionCmd.description}>{button}</Tooltip>
      }
      return button
    }
    return null
  }

  const className = "Section-root" + (props.className ? " " + props.className : "")
  return (
    <Box className={className} sx={Section_SxProps}>
      <Box className="Section-header" sx={{ display: "flex", width: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          {props.title && (
            <Typography
              className={props.variant === "large" ? "Section-title Section-largeTitle" : "Section-title"}
              variant={props.variant === "large" ? "h5" : "h6"}
              color="text.primary"
            >
              {props.title}
            </Typography>
          )}
          {props.description && (
            <Typography className="Section-description" variant="body2" color="text.secondary">
              {props.description}
            </Typography>
          )}
        </Box>
        {renderAction()}
      </Box>
      {props.commands && (
        <IconButtonGroup
          className="Section-commands"
          commands={props.commands}
          size="small"
          onCommand={props.onCommand}
        />
      )}
      {props.children && <Box className="Section-children">{props.children}</Box>}
    </Box>
  )
}
