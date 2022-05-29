//
// tip.tsx - a small box used to given additional info on request or hover
//

import { useState } from "react"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"

interface TipProps {
  title: string
  children: any
  variant?: "link"
}

/** A tipbox used to give additional information */
export function Tip({ title, children, variant }: TipProps) {
  const [isOpen, setOpen] = useState(false)
  return (
    <>
      <Link variant="subtitle2" onClick={(e) => setOpen(!isOpen)} underline="none" sx={{ cursor: "pointer" }}>
        {title}
      </Link>
      {isOpen && (
        <Typography variant="body2" color="text.secondary">
          {children}
        </Typography>
      )}
    </>
  )
}
