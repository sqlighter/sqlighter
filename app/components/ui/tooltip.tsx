//
// tooltip.tsx - regular tooltip with some presets
//

import React from "react"
import { Tooltip as MuiTooltip, TooltipProps } from "@mui/material"

// delay before showing tooltips
export const TOOLTIP_ENTER_DELAY_MS = 1000

export function Tooltip(props: TooltipProps) {
  return <MuiTooltip {...props} enterDelay={TOOLTIP_ENTER_DELAY_MS} />
}
