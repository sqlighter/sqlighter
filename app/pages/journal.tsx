//
// journal.tsx - show biomarker measurements, events, personal data, etc.
//

import React, { useContext } from "react"

import Box from "@mui/system/Box"
import Timeline from "@mui/lab/Timeline"
import FileUploadIcon from "@mui/icons-material/FileUploadOutlined"

import { useApi } from "../lib/api"
import { prettyDate } from "../lib/shared"
import { generateId } from "../lib/items/items"
import emptyImage from "../public/images/empty1.jpg"

import { JournalEntry } from "../components/journals"
import { TagsCloud } from "../components/tags"
import { AppLayout } from "../components/layouts"
import { SigninPanel } from "../components/signin"
import { Context } from "../components/context"
import { Empty } from "../components/empty"
import { UploadButton } from "../components/upload"

function JournalContentEntry({ item }) {
  const title = item.title || "Documents"
  const description = prettyDate(item.createdAt)
  const href = `/${item.type}s/${item.id}`

  let measurements = null
  if (item.measurements) {
    const tags = item.measurements.map((m) => {
      return { label: m.title || m.biomarker, risk: m.risk, href: `/${item.type}s/${item.id}#${m.biomarker}` }
    })
    measurements = <TagsCloud items={tags} />
  }

  const content = (
    <>
      {(item.description || item.content) && (
        <Box sx={{ display: "-webkit-box", overflow: "hidden", WebkitBoxOrient: "vertical", WebkitLineClamp: 3 }}>
          {item.description && <Box>{item.description}</Box>}
          {item.content && <Box>{item.content}</Box>}
        </Box>
      )}
      {measurements && <Box mt={2}>{measurements}</Box>}
    </>
  )

  return (
    <JournalEntry title={title} description={description} href={href}>
      {content}
    </JournalEntry>
  )
}

interface JournalPageProps {
  //
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
        <Timeline position="right" sx={{ paddingLeft: 0, paddingRight: 0 }}>
          <JournalEntry title="Save your Results" description={prettyDate()} icon={<FileUploadIcon />}>
            <Box mb={2}>
              Upload your lab results (PDF files) and we'll process then in the next 24-48 hours. You will receive a
              notification when they are ready. You can also enter your biomarker's values manually and they will be
              stored here.
            </Box>
            <UploadButton
              itemType="record"
              itemId={itemId}
              onUploaded={handleUploaded}
              onProgress={handleUploadProgress}
            />
          </JournalEntry>

          {records &&
            records.map((item) => {
              return <JournalContentEntry key={item.id} item={item} />
            })}
        </Timeline>
      </Box>
    )
  }

  let content = null
  if (!context.user) {
    // not logged in? suggest logging in
    content = <SigninPanel />
  } else if (!records && !recordsLoading) {
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

  return (
    <AppLayout title="Journal" description="Track your progress">
      {content}
    </AppLayout>
  )
}
