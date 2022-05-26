//
// journal.tsx
//

import React, { useContext } from "react"
import { AppLayout } from "../components/layouts"
import { Context } from "../components/context"

interface JournalPageProps {
  //
}

export default function JournalPage(props: JournalPageProps) {
  const context = useContext(Context)

  return (
    <AppLayout title="Journal" description="Track your progress">
      TBD
    </AppLayout>
  )
}
