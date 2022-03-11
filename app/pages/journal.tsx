//
// journal.tsx - show biomarker measurements, events, personal data, etc.
//

import React, { useContext, useCallback, useState } from "react"
import Box from "@mui/system/Box"
import Typography from "@mui/material/Typography"

import Tooltip from "@mui/material/Tooltip"
import Timeline from "@mui/lab/Timeline"
import TimelineItem from "@mui/lab/TimelineItem"
import TimelineSeparator from "@mui/lab/TimelineSeparator"
import TimelineConnector from "@mui/lab/TimelineConnector"
import TimelineContent from "@mui/lab/TimelineContent"
import TimelineDot from "@mui/lab/TimelineDot"
import { TimelineOppositeContent } from "@mui/lab"
import Chip from "@mui/material/Chip"
import Badge from "@mui/material/Badge"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import AttachmentIcon from "@mui/icons-material/FilePresentOutlined"
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined"
import VideoFileOutlinedIcon from "@mui/icons-material/VideoFileOutlined"
import AudioFileOutlinedIcon from "@mui/icons-material/AudioFileOutlined"

import { generateId } from "../lib/items/items"
import { AppLayout } from "../components/layouts"
import { SigninPanel } from "../components/signin"
import { Context } from "../components/context"
import { Empty } from "../components/empty"
import emptyImage from "../public/images/empty1.jpg"
import { useApi } from "../lib/api"
import { UploadButton } from "../components/upload"
import { BiomarkerTag } from "../components/tags"
import { FileIconButton } from "../components/files"
import { prettyBytes, prettyContentType } from "../lib/shared"

function JournalEntryContent({ item }) {
  const title = item.title || item.id
  const subtitle = item.description || "subtitle of this section"

  return (
    <Box mb={4}>
      <Box>
        <Typography variant="h3" color="text.primary">
          {title}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
      {item.content && (
        <Box mt={1}>
          <Typography
            variant="body1"
            color="text.primary"
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
          >
            {item.content}
          </Typography>
        </Box>
      )}
      {item.measurements && (
        <Box mt={2} display="flex" flexWrap="wrap">
          {item.measurements.map((measurement, index) => {
            return (
              <Box key={`measurement${index}`} sx={{ marginRight: 1, marginBottom: 1 }}>
                <BiomarkerTag
                  key={measurement.biomarker}
                  label={measurement.title || measurement.biomarker}
                  risk={measurement.risk}
                  href={`/${item.type}s/${item.id}#${measurement.biomarker}`}
                />
              </Box>
            )
          })}
        </Box>
      )}
      {item.files && (
        <Box mt={1}>
          {item.files.map((file, index) => {
            return (
              <FileIconButton
                key={`${item.id}-file${index}`}
                item={file}
                edge={index == 0 ? "start" : undefined}
                sx={{ color: "primary.light" }}
              />
            )
          })}
        </Box>
      )}
    </Box>
  )
}

function JournalEntry({ item }) {
  return (
    <TimelineItem>
      <TimelineOppositeContent
        style={{ maxWidth: "1px", paddingLeft: "0px", paddingRight: "0px" }}
      ></TimelineOppositeContent>
      <TimelineSeparator color="primary">
        <TimelineDot variant="outlined" sx={{ color: "primary.light", borderColor: "primary.light" }}>
          <InsertDriveFileOutlinedIcon fontSize="small" />
        </TimelineDot>
        <TimelineConnector sx={{ bgcolor: "primary.light" }} />
      </TimelineSeparator>
      <TimelineContent sx={{ width: "100%" }}>
        <JournalEntryContent item={item} />
      </TimelineContent>
    </TimelineItem>
  )
}

interface JournalPageProps {
  /** List of available health records */
  records: any[]
}

export default function JournalPage(props: JournalPageProps) {
  const context = useContext(Context)

  // user records order by time desc
  const { data: records, isLoading: recordsLoading } = useApi("/api/records")

  let itemId = generateId("rcd_")

  function handleUploaded(item, fileBag, allUploaded) {
    console.log(`JournalPage.handleUploaded - ${item.id}`, item, fileBag)
  }

  function handleUploadProgress(progress, fileBags) {
    // console.log(`JournalPage.handleUploadProgress - ${progress}%`, fileBags)
  }

  function getRecords() {
    return (
      <Box width="100%" overflow="hidden">
        <UploadButton itemType="record" itemId={itemId} onUploaded={handleUploaded} onProgress={handleUploadProgress} />

        <Timeline position="right" sx={{ paddingLeft: 0 }}>
          {records &&
            records.map((item) => {
              return <JournalEntry key={item.id} item={item} />
            })}
        </Timeline>

      </Box>
    )
  }

  let content = null
  if (!context.user) {
    // not logged in? suggest logging in
    content = <SigninPanel />
  } else if (!records) {
    // no records? suggest uploading docs
    content = (
      <Empty
        title="No records yet"
        description="Upload your lab results to start learning now"
        image={emptyImage}
        action={<UploadButton itemType="record" itemId={itemId} onUploaded={handleUploaded} />}
      />
    )
  } else {
    content = getRecords()
  }

  /*      {context.user && (
        <Fab
          aria-label="Upload"
          color="primary"
          variant="extended"
          sx={{ position: "absolute", right: 32, bottom: 80 }}
        >
          <UploadIcon sx={{ mr: 1 }} />
          Upload
        </Fab>
      )}
*/

  return (
    <AppLayout title="Journal" description="Track your progress">
      {content}
    </AppLayout>
  )
}

/*
// https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props
export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}
*/
