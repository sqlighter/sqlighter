//
// journal.tsx - show biomarker measurements, events, personal data, etc.
//

import React, { useContext, useCallback, useState } from "react"
import Box from "@mui/system/Box"
import Typography from "@mui/material/Typography"

import { generateId } from "../lib/items/items"
import { AppLayout } from "../components/layouts"
import { SigninPanel } from "../components/signin"
import { Context } from "../components/context"
import { Empty } from "../components/empty"
import emptyImage from "../public/images/empty1.jpg"
import { useApi } from "../lib/api"
import { UploadButton } from "../components/upload"

interface JournalPageProps {
  /** List of available health records */
  records: any[]
}

export default function JournalPage(props: JournalPageProps) {
  const context = useContext(Context)

  // user records order by time desc
  const { data: records, isLoading: recordsLoading } = useApi("/api/records")

  let itemId = generateId("rcd_") // "rcd_xxxxx" // Record.generateId()

  function handleUploaded(item, fileBag, allUploaded) {
    console.log(`JournalPage.handleUploaded - ${item.id}`, item, fileBag)
  }

  function handleUploadProgress(progress, fileBags) {
    // console.log(`JournalPage.handleUploadProgress - ${progress}%`, fileBags)
  }

  function getRecords() {
    return (
      <>
        <UploadButton itemType="record" itemId={itemId} onUploaded={handleUploaded} onProgress={handleUploadProgress} />
        {records &&
          records.map((record) => {
            return (
              <Box key={record.id} mb={2}>
                <Typography variant="body1">
                  {record.id} / {record.createdAt}
                </Typography>
                {record.files &&
                  record.files.map((file) => {
                    return (
                      <Box key={file.id} ml={4}>
                        <Typography variant="subtitle1" color="text.secondary">
                          {file.id}
                        </Typography>
                      </Box>
                    )
                  })}
              </Box>
            )
          })}
      </>
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
export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}
*/
