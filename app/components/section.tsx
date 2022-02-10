//
// section.tsx - a section of content
//

import Typography from "@mui/material/Typography"

interface SectionProps {
  title?: string
  subtitle?: string
  children: any
}

export function Section({ title, subtitle, children }: SectionProps) {
  return (
    <section>
      {title && <Typography variant="h4">{title}</Typography>}
      {subtitle && <Typography variant="body2">{subtitle}</Typography>}
      {children}
    </section>
  )
}
