//
// usewidescreen.tsx - returns true if screen wider than given breakpoint
//

import { Theme, Breakpoint } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"

/** Returns true if screen wider than given breakpoint, default is medium (900px) */
export function useWideScreen(breakpoint: Breakpoint = "md") {
  const isWideScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up(breakpoint))
  return [isWideScreen]
}
