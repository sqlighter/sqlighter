//
// section.tsx - a section of content
//

import Typography from "@mui/material/Typography"

interface SectionProps {
  title?: string
  subtitle?: string,
  large?: boolean
  children: any
}

export function Section({ title, subtitle, large, children }: SectionProps) {
  return (
    <section>
      {title && <Typography variant={large ? "h2" : "h4"}>{title}</Typography>}
      {subtitle && (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {subtitle}
        </Typography>
      )}
      {children}
    </section>
  )
}
