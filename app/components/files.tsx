//
// files.tsx - show biomarker measurements, events, personal data, etc.
//

import React, { useContext, useCallback, useState } from "react"

import { Theme } from "@mui/material/styles"
import { SxProps } from "@mui/material"
import Box from "@mui/system/Box"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import AttachmentFileIcon from "@mui/icons-material/FilePresentOutlined"
import VideoFileIcon from "@mui/icons-material/VideoFileOutlined"
import AudioFileIcon from "@mui/icons-material/AudioFileOutlined"

import { capitalize, prettyBytes, prettyContentType } from "../lib/shared"

interface File {
  id: string
  contentType: string
  size: number
}

function FileIcon({ contentType }) {
  //  switch (contentType) {
  //   case "application/pdf":
  return <AttachmentFileIcon fontSize="medium" color="inherit" />
  // }
  // return <InsertDriveFileOutlinedIcon color="secondary" />
}

interface FileIconButtonProps {
  /** File item to be shown */
  item: File

  /** If given, uses a negative margin to counteract the padding on one side (this is often helpful for aligning the left or right side of the icon with content above or below, without ruining the border size and shape). */
  edge?: "start" | "end"

  /** Additional properties */
  sx?: SxProps<Theme>
}

/** Shows a clickable button representing a file */
export function FileIconButton({ item, edge, sx }: FileIconButtonProps) {
  const contentType = prettyContentType(item.contentType)
  const fileSize = prettyBytes(item.size)
  const tooltip = `${contentType} | ${fileSize}`.toLowerCase()

  function handleClick(e) {
    console.log(`FileIconButton - ${item.id}, clicked`)
    // TODO href should be provided to page to be opened, etc
  }
  // onClick={handleClick}
  return (
    <Tooltip title={tooltip}>
      <IconButton color="primary" edge={edge} href="/pippone" sx={sx}>
        <FileIcon contentType={item.contentType} />
      </IconButton>
    </Tooltip>
  )
}
