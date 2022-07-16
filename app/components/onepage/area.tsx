//
// area.tsx - horizontal area with background color and width limiting container per one page sites
//

import { SxProps, Theme } from "@mui/material"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"

interface AreaProps {
  /** Component's class name (optional) */
  className?: string
  /** Light or darker background? Default is white */
  background?: "white" | "gray"
  /** Maximum page width, defaults to 'lg' */
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl"
  /** Area contents */
  children: any
}

/** A vertical section of a one page style site */
export function Area(props: AreaProps) {
  const Area_SxProps: SxProps<Theme> = {
    width: 1,
    backgroundColor: props.background == "gray" ? "background.default" : undefined,
  }

  const className = "Area-root" + (props.className ? " " + props.className : "")
  return (
    <Box className={className} sx={Area_SxProps}>
      <Container maxWidth={props.maxWidth || "lg"}>{props.children}</Container>
    </Box>
  )
}
