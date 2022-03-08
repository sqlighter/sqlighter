//
// journal.tsx - show biomarker measurements, events, personal data, etc.
//

import React, { useContext, useCallback } from "react"
import useFileUploader from "react-uploader-hook"

import Button from "@mui/material/Button"
import Fab from "@mui/material/Fab"
import UploadIcon from "@mui/icons-material/UploadFileOutlined"

import { AppLayout } from "../components/layouts"
import { SigninPanel } from "../components/signin"
import { Context } from "../components/context"
import { Empty } from "../components/empty"
import emptyImage from "../public/images/empty1.jpg"

interface JournalPageProps {
  /** List of available health records */
  records: any[]
}

function UploadButton(props) {
  const getUploadParams = useCallback((file) => {
    // [💡] you can return custom request configurations here
    const form = new FormData()
    form.append("file", file)
    return {
      method: "post",
      url: "https://file.io?expires=1w",
      headers: { "Content-Type": "multipart/form-data" },
      data: form,
      meta: { "any-other-stuff": "hello" },
    }
  }, [])

  const onUploaded = useCallback((fileBag) => {
    // [💡] do whatever with the uploaded files
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
  return (
    <>
      <p>Journal entries here...</p>
      <UploadButton />
    </>
  )
}

export default function JournalPage(props: JournalPageProps) {
  const context = useContext(Context)

  let content = null
  if (!context.user) {
    // not logged in? suggest logging in
    content = <SigninPanel />
  } else if (!props.records) {
    // no records? suggest uploading docs
    content = (
      <Empty
        title="No records yet"
        description="Upload your lab results to start learning now"
        image={emptyImage}
        action={<UploadButton />}
      />
    )
  } else {
    content = <Journal {...props} />
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

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}
