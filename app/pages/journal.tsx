//
// journal.tsx - show biomarker measurements, events, personal data, etc.
//

import React, { useContext, useCallback, useState } from "react"
import Box from "@mui/system/Box"
import Typography from "@mui/material/Typography"

import Timeline from "@mui/lab/Timeline"
import TimelineItem from "@mui/lab/TimelineItem"
import TimelineSeparator from "@mui/lab/TimelineSeparator"
import TimelineConnector from "@mui/lab/TimelineConnector"
import TimelineContent from "@mui/lab/TimelineContent"
import TimelineDot from "@mui/lab/TimelineDot"
import { TimelineOppositeContent } from "@mui/lab"
import Chip from "@mui/material/Chip"
import Badge from "@mui/material/Badge"
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

function FileIcon({ contentType }) {
  switch (contentType) {
    case "application/pdf":
      return <AttachmentIcon fontSize="large" />
  }
  return <InsertDriveFileOutlinedIcon sx={{ fontSize: 64 }} color="secondary" />
}

function JournalEntryFiles({ item }) {
  return (
    <>
      {item.files.map((file) => {
        return (
          <Box key={file.id}>
            <FileIcon contentType={file.contentType} />
            <Typography variant="caption">{JSON.stringify(file)}</Typography>
            {file.id}
          </Box>
        )
      })}
    </>
  )
}

function JournalEntryContent({ item }) {
  return (
    <Box mb={4}>
      <Typography variant="body1">{item.title || item.id}</Typography>
      <Typography variant="subtitle2" color="text.secondary">
        {item.createdAt}
      </Typography>
      {item.description && (
        <Typography variant="body1" color="text.primary">
          {item.description}
        </Typography>
      )}

      {item.measurements && (
        <>
          <Typography variant="overline">Biomarkers</Typography>
          <Box display="flex" flexWrap="wrap">
            {item.measurements.map((measurement) => {
              return (
                <Box sx={{ marginRight: 1, marginBottom: 1 }}>
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
        </>
      )}
      {item.files && (
        <>
          <Typography variant="overline">Documents</Typography>
          <JournalEntryFiles item={item} />
        </>
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
      <TimelineSeparator color="secondary">
        <TimelineDot color="secondary">
          <InsertDriveFileOutlinedIcon fontSize="small" />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ width: 600 }}>
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
  const user = context.user

  // user records order by time desc
  const { data: records, isLoading: recordsLoading } = useApi(user && "/api/records")

  let itemId = generateId("rcd_") // "rcd_xxxxx" // Record.generateId()

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
          ì{" "}
        </Timeline>

        {records &&
          records.map((record) => {
            return (
              <Box key={record.id} mb={2}>
                <Typography variant="body1" noWrap={true}>
                  {record.id} / {record.createdAt}
                </Typography>
                {record.files &&
                  record.files.map((file) => {
                    return (
                      <Box key={file.id} ml={4}>
                        <Typography variant="subtitle1" color="text.secondary" noWrap={true}>
                          {file.id}
                        </Typography>
                      </Box>
                    )
                  })}
              </Box>
            )
          })}
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
