//
// journals.tsx - basic components used to build a journal page with an events timeline
//

import React from "react"
import NextLink from "next/link"

import Link from "@mui/material/Link"
import Box from "@mui/system/Box"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import Chip from "@mui/material/Chip"
import Badge from "@mui/material/Badge"
import Button from "@mui/material/Button"
import ButtonBase from "@mui/material/ButtonBase"
import IconButton from "@mui/material/IconButton"

import AttachmentIcon from "@mui/icons-material/FilePresentOutlined"
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined"
import VideoFileOutlinedIcon from "@mui/icons-material/VideoFileOutlined"
import AudioFileOutlinedIcon from "@mui/icons-material/AudioFileOutlined"
import FileDownloadIcon from "@mui/icons-material/FileDownloadOutlined"
import ScienceIcon from "@mui/icons-material/ScienceOutlined"
import FileIcon from "@mui/icons-material/InsertDriveFileOutlined"

import Timeline from "@mui/lab/Timeline"
import TimelineItem from "@mui/lab/TimelineItem"
import TimelineSeparator from "@mui/lab/TimelineSeparator"
import TimelineConnector from "@mui/lab/TimelineConnector"
import TimelineContent from "@mui/lab/TimelineContent"
import TimelineDot from "@mui/lab/TimelineDot"
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent"

interface JournalEntryProps {
  /** Icon is optional, default is document icon */
  icon?: React.ReactElement

  /** Entry title */
  title: string

  /** Entry description (optional) */
  description?: string

  /** Action buttons shown on the right of the titles */
  actions?: React.ReactElement

  /** Callback when item is clicked */
  onClick?: React.EventHandler<any>

  /** Routes to this page when clicked */
  href?: string

  /** Plain text or elements shown as content */
  children?: string | React.ReactElement | React.ReactElement[]
}

/** A Timeline entry in a page with journaling events */
export function JournalEntry({ icon, title, description, actions, href, children }: JournalEntryProps) {
  const timelineColor = "text.secondary"
  let entry = (
    <TimelineItem>
      <TimelineOppositeContent style={{ maxWidth: 0, paddingLeft: 0, paddingRight: 0 }} />
      <TimelineSeparator color="primary">
        <TimelineDot variant="outlined" sx={{ color: timelineColor, borderColor: timelineColor }}>
          {icon ? icon : <FileIcon />}
        </TimelineDot>
        <TimelineConnector sx={{ bgcolor: timelineColor }} />
      </TimelineSeparator>
      <TimelineContent sx={{ width: 240, marginRight: 0, paddingRight: 0 }}>
        <Box mb={6}>
          <Box display="flex">
            <Box width="100%" flexGrow={1}>
              {title &&
                (href ? (
                  <NextLink href={href} passHref={true}>
                    <Link variant="h3" underline="hover" noWrap={true} href={href}>
                      {title}
                    </Link>
                  </NextLink>
                ) : (
                  <Typography variant="h3" color="text.primary" noWrap={true}>
                    {title}
                  </Typography>
                ))}
              {description && (
                <Typography variant="subtitle2" color="text.secondary" noWrap={true}>
                  {description}
                </Typography>
              )}
            </Box>
            {actions && <Box sx={{ marginTop: -0.5 }}>{actions}</Box>}
          </Box>
          {children && (
            <Box mt={2} width="100%">
              <Typography variant="body1" color="text.primary">
                {children}
              </Typography>
            </Box>
          )}
        </Box>
      </TimelineContent>
    </TimelineItem>
  )

  if (href) {
    //    entry = <Link href={href}>{entry}</Link>
  }

  return entry
}
