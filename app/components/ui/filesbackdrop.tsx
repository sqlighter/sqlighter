/**
 * filesbackdrop.tsx
 */

import React from "react"
import { SxProps, Theme, alpha } from "@mui/material"
import { BackdropProps } from "@mui/material"
import Box from "@mui/material/Box"
import Backdrop from "@mui/material/Backdrop"
import Typography from "@mui/material/Typography"

const FilesBackdrop_SxProps: SxProps<Theme> = {
  // translucid blurred background with theme tint
  backgroundColor: (theme) => alpha(theme.palette.background.default, 0.6),
  backdropFilter: "blur(8px)",
  zIndex: (theme) => theme.zIndex.drawer + 1,

  display: "flex",
  flexDirection: "column",
}

/** A simple backdrop shown while files are being dropped on the page */
export function FilesBackdrop(props: BackdropProps) {
  let { className, ...backdropProps } = props
  className = "FilesBackdrop-root" + (className ? " " + className : "")
  return (
    <Backdrop className={className} {...backdropProps} sx={FilesBackdrop_SxProps}>
      <Box sx={{ fontSize: 128 }}>🎉</Box>
      <Typography variant="h6" fontWeight="bold">
        Drop your files anywhere to open
      </Typography>
      <Typography variant="body2" color="text.secondary">
        We support .db, .sqlite and .csv files
      </Typography>
    </Backdrop>
  )
}
