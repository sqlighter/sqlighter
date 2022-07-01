//
// area.tsx - layout for onepage marketing site and utility pages like terms, privacy, etc.
//

import Head from "next/head"

import { SxProps, Theme, alpha } from "@mui/material"
import Container from "@mui/material/Container"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"

import { PanelProps } from "../navigation/panel"

export const TITLE = "sqlighter"
export const HEADER_HEIGHT = 64

const Area_SxProps: SxProps<Theme> = {
  paddingBottom: 4,

  ".Area-gray": {
    backgroundColor: "background.default",
  },
}

interface AreaProps {
  /** Component's class name (optional) */
  className?: string
  /** Light or darker background? Default is white */
  background?: "white" | "gray"
  /** Area contents */
  children: any
}

/** A vertical section of a one page style site */
export function Area(props: AreaProps) {
  const className = "Area-root" + (props.className ? " " + props.className : "")
  return (
    <Container className={className} sx={Area_SxProps} maxWidth="lg">
      <Box className={props.background == "gray" ? "Area-gray" : undefined}>{props.children}</Box>
    </Container>
  )
}
