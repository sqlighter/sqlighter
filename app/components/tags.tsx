//
// tags.tsx - tag chips for articles tags, biomarkers with colored risk dots, etc
//

import React from "react"
import Link from "next/link"
import { Theme } from "@mui/material/styles"
import { SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import Badge from "@mui/material/Badge"
import Chip from "@mui/material/Chip"

/** Risk associated with a biomarker level or action */
export type Risk = "normal" | "medium" | "high"

//
// RiskBadge - a little circular dot badge showing the item's risk
//

interface RiskBadgeProps {
  /** Badge is shown in this risk's color or not shown at all if null */
  risk?: Risk

  /** Content tagged with this badge */
  children: React.ReactNode
}

export function getRiskColor(risk: Risk): "success" | "warning" | "error" | null {
  switch (risk) {
    case "normal":
      return "success"
    case "medium":
      return "warning"
    case "high":
      return "error"
  }
  return null
}

/** Shows a dot badge colored according to risk on an item */
export function RiskBadge({ risk, children }: RiskBadgeProps) {
  const color = getRiskColor(risk)
  if (!color) {
    return <>{children}</>
  }
  return (
    <Badge color={color} variant="dot" overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      {children}
    </Badge>
  )
}

//
// Tag - a clickable tag chip
//

interface TagProps {
  /** Label shown in chip */
  label: string

  /** Chip is clickable and takes to this page (optional) */
  href?: string

  /** Dot badge is shown in this color (optional) */
  dot?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"

  /** Dot badge colored according to risk (optional) */
  risk?: Risk

  /** Chip size (default is medium) */
  size?: "medium" | "small"

  /** Callback for onClick */
  onClick?: React.EventHandler<any>

  /** Additional properties */
  sx?: SxProps<Theme>
}

/** A clickable tag possibly showing a colored dot badge on it */
export function Tag({ label, dot, risk, href, onClick, size, sx }: TagProps) {
  let tag = <Chip variant="outlined" onClick={onClick} label={label} size={size} sx={sx} />

  // wrap in clickable link?
  if (href) {
    tag = <Link href={href}>{tag}</Link>
  }

  // wrap in dot badge?
  if (dot || risk) {
    if (risk) {
      dot = getRiskColor(risk)
    }
    tag = (
      <Badge color={dot} variant="dot" overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        {tag}
      </Badge>
    )
  }

  return tag
}

/** A list of clickable tags */
export function TagsCloud({ items }) {
  return (
    <Box display="flex" flexWrap="wrap">
      {items.map((item, index) => (
        <Box key={`measurement${index}`} sx={{ marginRight: 1, marginBottom: 1 }}>
          <Tag key={index} {...item} />
        </Box>
      ))}
    </Box>
  )
}
