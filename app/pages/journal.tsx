//
// journal.tsx - show biomarker measurements, events, personal data, etc.
//

import React, { useContext, useCallback, useState } from "react"
import useFileUploader from "react-uploader-hook"
import useSWR, { useSWRConfig } from "swr"

import Button from "@mui/material/Button"
import Fab from "@mui/material/Fab"
import UploadIcon from "@mui/icons-material/UploadFileOutlined"

import { AppLayout } from "../components/layouts"
import { SigninPanel } from "../components/signin"
import { Context } from "../components/context"
import { Empty } from "../components/empty"
import emptyImage from "../public/images/empty1.jpg"

import { useApi } from "../lib/api"
import { Box } from "@mui/system"

//import { Record } from "../lib/items/records"

interface JournalPageProps {
  /** List of available health records */
  records: any[]
}

interface UploadButtonProps {
  itemType: string

  /** Item we're uploading files to, eg. /api/records/rcd_xxxxxx */
  itemId: string

  /** Called when a file has been uploaded to storage */
  onUploaded?: any
}

function UploadButton(props: UploadButtonProps) {
  const itemType = props.itemType
  const itemId = props.itemId

  const { mutate } = useSWRConfig()

  const getUploadParams = useCallback(async (file) => {
    console.log(`getUploadParams`, file)
    try {
      const r = await fetch(`/api/${props.itemType}s/${props.itemId}/files/upload/sign`, {
        method: "put",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, size: file.size, contentType: file.type }),
      })
      console.log(`getUploadParams - done`, r)

      let { data, metadata } = await r.json()
      console.log(`getUploadParams - data`, data, metadata)

      // [💡] you can return custom request configurations here
      //     const form = new FormData()
      //   form.append("file", file)
      return {
        method: "put",
        url: metadata.signedUrl,
        headers: { "Content-Type": file.type },
        //        data: form,
        data: file,
      }
    } catch (exception) {
      console.error(`getUploadParams - exception: ${exception}`, exception)
    }
  }, [])

  const onUploaded = useCallback(async (fileBag) => {
    console.debug(`UploadButton - uploaded, mutating ${itemId}`, fileBag)

    // notify server that file upload on google storage has completed
    const r = await fetch(`/api/${props.itemType}s/${props.itemId}/files/upload/complete`, {
      method: "put",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ filename: fileBag.file.name, size: fileBag.file.size, contentType: fileBag.file.type }),
    })

    mutate(`/api/${itemType}s/${itemId}`)
    mutate(`/api/${itemType}s`)
    if (props.onUploaded) {
      props.onUploaded(fileBag)
    }
  }, [])

  // [⭐]
  const { onDrop, fileBags } = useFileUploader({ getUploadParams, onUploaded })

  const handleChange = useCallback(
    (event) => {
      onDrop(event.target.files)
    },
    [onDrop]
  )

  function handleUpload(e) {
    const file = e?.target?.files?.[0]
    if (file) {
      console.debug(`UploadButton.handleUpload - ${file.name} ${Math.round(file.size / 1024)} kB`, file)
    }
  }

  return (
    <>
      <label htmlFor="contained-button-file">
        <input
          accept="application/pdf"
          id="contained-button-file"
          type="file"
          style={{ display: "none" }}
          onChange={handleChange}
          multiple={true}
        />
        <Button variant="outlined" component="span">
          Upload
        </Button>
      </label>
      <pre>{JSON.stringify(fileBags, null, 2)}</pre>
    </>
  )
}

export default function JournalPage(props: JournalPageProps) {
  const context = useContext(Context)

  // user records order by time desc
  const { data: records, isLoading: recordsLoading } = useApi("/api/records")

  let itemId = "rcd_xxxxx" // Record.generateId()

  function handleUploaded(fileBag) {
    console.log(`JournalPage.handleUploaded`, fileBag)
  }

  function getRecords() {
    return (
      <>
        <p>Journal entries</p>
        <UploadButton itemType="record" itemId={itemId} onUploaded={handleUploaded} />
        {records &&
          records.map((record) => {
            return (
              <Box key={record.id}>
                {record.id} / {record.createdAt}
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
