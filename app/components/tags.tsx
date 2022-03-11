//
// tags.tsx - tag chips for articles tags, biomarkers with colored risk dots, etc
//

import React from "react"
import { Theme } from "@mui/material/styles"
import { SxProps } from "@mui/material"
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

/** Shows a dot badge colored according to risk on an item */
export function RiskBadge({ risk, children }: RiskBadgeProps) {
  if (!risk) {
    return <>{children}</>
  }

  let color: any
  switch (risk) {
    case "normal":
      color = "success"
      break
    case "medium":
      color = "warning"
      break
    case "high":
      color = "error"
      break
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

  /** Chip size (default is medium) */
  size?: "medium" | "small"

  /** Callback for onClick */
  onClick?: React.EventHandler<any>

  /** Additional properties */
  sx?: SxProps<Theme>
}

/** A clickable tag possibly showing a colored dot badge on it */
export function Tag({ label, href, dot, onClick, size, sx }: TagProps) {
  // console.debug(`Tag - label: ${label}, dot: ${dot}, href: ${href}`)
  let tag

  // having an onClick handler gives the chip its hover and click effects
  const handler = href || onClick ? handleClick : null
  if (href) {
    tag = <Chip variant="outlined" onClick={handler} label={label} size={size} sx={sx} component="a" href={href} />
  } else {
    tag = <Chip variant="outlined" onClick={handler} label={label} size={size} sx={sx} />
  }

  function handleClick(e) {
    console.debug(`Tag - label: ${label}, clicked`)
    if (onClick) {
      onClick(e)
    }
  }

  if (dot) {
    return (
      <Badge color={dot} variant="dot" overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        {tag}
      </Badge>
    )
  }

  return tag
}

//
// BiomarkerTag - a clickable biomarker tag chip with a risk level badge
//

interface BiomarkerTagProps extends TagProps {
  /** Biomarker risk level (missing, no dot) */
  risk?: Risk
}

/** A clickable chip used to show a biomarker possibly with a risk dot */
export function BiomarkerTag({ risk, ...props }: BiomarkerTagProps) {
  return (
    <RiskBadge risk={risk}>
      <Tag {...props} />
    </RiskBadge>
  )
}
