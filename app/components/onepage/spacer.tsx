//
// spacer.tsx - empty box that adds vertical space
//

import Box from "@mui/material/Box"
import { useWideScreen } from "../hooks/usewidescreen"

interface SpacerProps {
  /** Amount of space, default is large */
  height?: "small" | "large" | number
}

/** Empty box that adds responsive vertical space */
export function Spacer(props: SpacerProps) {
  const [isWideScreen] = useWideScreen()
  let height = isWideScreen ? 80 : 36

  if (props.height == "small") {
    height = isWideScreen ? 36 : 16
  } else if (typeof props.height == "number") {
    height = props.height
  }

  return <Box sx={{ height }} />
}
