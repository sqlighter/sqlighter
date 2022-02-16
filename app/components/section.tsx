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
      <Box mb={1}>
        {title && (
          <Typography variant={large ? "h2" : "h3"} color="text.primary">
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box mb={2}>{children}</Box>
    </section>
  )
}
