//
// section.tsx - a section of content
//

import { ReactElement } from "react"
import { SxProps, Theme } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

export interface SectionProps {
  /** Class name applied to this component */
  className?: string

  /** Section title */
  title?: string | any

  /** Section subtitle (optional) */
  subtitle?: string | any

  /** Larger title? Default regular */
  variant?: "default" | "large"

  /** Section contents */
  children: ReactElement | ReactElement[]

  /** Style to be passed to children components */
  sx?: SxProps<Theme>
}

/** A content section with standardized style and structure */
export function Section(props: SectionProps) {
  const className = "Section-root" + (props.className ? " " + props.className :  "")
  return (
    <section className={className} aria-label={props.title}>
      {props.title && (
        <Typography variant={props.variant === "large" ? "h5" : "h6"} color="text.primary">
          {props.title}
        </Typography>
      )}
      {props.subtitle && (
        <Typography variant="body1" color="text.secondary">
          {props.subtitle}
        </Typography>
      )}
      {props.children && <Box mb={4} sx={props.sx}>{props.children}</Box>}
    </section>
  )
}
