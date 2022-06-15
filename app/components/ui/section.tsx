//
// section.tsx - a section of content
//

import { ReactElement } from "react"
import { SxProps, Theme } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

import { PanelProps } from "../navigation/panel"
import { Command, CommandEvent } from "../../lib/commands"
import { IconButtonGroup } from "./iconbuttongroup"

const Section_SxProps: SxProps<Theme> = {}

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
  action?: Command | ReactElement

  /** Larger title? Default regular */
  variant?: "default" | "large"

  /** Section contents */
  children: ReactElement | ReactElement[]

  /** Callback used by this panel to dispatch commands back to parent components */
  onCommand?: CommandEvent
}

/** A content section with standardized style and structure */
export function Section(props: SectionProps) {
  const className = "Section-root" + (props.className ? " " + props.className : "")

  function renderAction() {
    if (props.action) {
      if (props.action?.command) {
        const actionCmd = props.action as Command
        return (
          <Button variant="outlined" onClick={(e) => props.onCommand(e, actionCmd)}>{actionCmd.title}</Button>
        )
      }
      return props.action
    }
    return null
  }

  return (
    <section aria-label={props.title}>
      <Box className={className} sx={Section_SxProps}>
        <Box sx={{ display: "flex", width: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            {props.title && (
              <Typography
                className="Section-title"
                variant={props.variant === "large" ? "h5" : "h6"}
                color="text.primary"
              >
                {props.title}
              </Typography>
            )}
            {props.description && (
              <Typography className="Section-description" variant="body1" color="text.secondary">
                {props.description}
              </Typography>
            )}
          </Box>
          {renderAction()}
        </Box>
        {props.commands && <IconButtonGroup commands={props.commands} onCommand={props.onCommand} />}
        {props.children && (
          <Box mt={1} mb={4}>
            {props.children}
          </Box>
        )}
      </Box>
    </section>
  )
}
