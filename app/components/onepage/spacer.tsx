//
// spacer.tsx - empty box that adds vertical space
//

import Box from "@mui/material/Box"

interface SpacerProps {
  /** Amount of space, default is large */
  height?: "small" | "large" | number
}

/** Empty box that adds vertical space */
export function Spacer(props: SpacerProps) {
  let height = 100
  if (props.height == "small") {
    height = 40
  } else if (typeof props.height == "number") {
    height = props.height
  }
  return <Box sx={{ height: 100 }} />
}
