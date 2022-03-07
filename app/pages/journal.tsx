//
// journal.tsx - show biomarker measurements, events, personal data, etc.
//

import * as React from "react"
import { useContext } from "react"

import { AppLayout } from "../components/layouts"
import { SigninPanel } from "../components/signin"
import { Context } from "../components/context"
import { Empty } from "../components/empty"
import emptyImage from "../public/images/empty1.jpg"

interface JournalPageProps {
  /** List of available health records */
  records: any[]
}

export default function JournalPage({ records }: JournalPageProps) {
  const context = useContext(Context)

  let content = null
  if (!context.user) {
    // not logged in? suggest logging in
    content = <SigninPanel />
  } else if (!records) {
    // no records? suggest uploading docs
    content = (
      <Empty title="No records yet" description="Upload your lab results to start learning now" image={emptyImage} />
    )
  } else {
    content = <>Records here...</>
  }

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
