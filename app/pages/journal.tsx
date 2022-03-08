//
// journal.tsx - show biomarker measurements, events, personal data, etc.
//

import React, { useContext, useCallback } from "react"
import useFileUploader from "react-uploader-hook"
import useSWR, { useSWRConfig } from 'swr'

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

interface JournalPageProps {
  /** List of available health records */
  records: any[]
}

interface UploadButtonProps {
  url: string

  onUploaded?: any
}

function UploadButton(props: UploadButtonProps) {
  const { mutate } = useSWRConfig()

  const getUploadParams = useCallback((file) => {
    // [💡] you can return custom request configurations here
    const form = new FormData()
    form.append("file", file)
    return {
      method: "post",
      url: props.url,
      headers: { "Content-Type": "multipart/form-data" },
      data: form,
    }
  }, [])

  const onUploaded = useCallback((fileBag) => {
    console.debug(`UploadButton - uploaded, mutating ${props.url}`, fileBag)
    mutate(props.url)
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

function Journal({ records }: JournalPageProps) {
  console.log(`Journal - records`, records)



  return (
    <>
      <p>Journal entries</p>
      <UploadButton url="/api/records" />
      {records &&
        records.map((record) => {
          return <Box key={record.id}>{record.id} / {record.createdAt}</Box>
        })}
    </>
  )
}

export default function JournalPage(props: JournalPageProps) {
  const context = useContext(Context)

  // user records order by time desc
  const { data: records, isLoading: recordsLoading } = useApi("/api/records")

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
        action={<UploadButton url="/api/records" />}
      />
    )
  } else {
    content = <Journal {...props} records={records} />
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
