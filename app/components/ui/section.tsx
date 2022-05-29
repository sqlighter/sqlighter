//
// section.tsx - a section of content
//

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

interface SectionProps {
  title?: string | any
  subtitle?: string | any
  large?: boolean
  children: any
}

export function Section({ title, subtitle, large, children }: SectionProps) {
  return (
    <section aria-label={title}>
      {title && (
        <Typography variant={large ? "h2" : "h3"} color="text.primary">
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
      <Box mb={4}>{children}</Box>
    </section>
  )
}
