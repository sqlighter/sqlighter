//
// journal.tsx - show biomarker measurements, events, personal data, etc.
//

import * as React from "react"
import Layout from "../components/layout"

interface JournalPageProps {
  //
}

export default function JournalPage(props: JournalPageProps) {
  return (
    <Layout title="Journal" subtitle="Track your progress">
      <section>
        THIS IS WORK IN PROGRESS. THE DEPLOYED APPLICATION IS NOT AT ALL COMPLETE, HAS NOT YET BEEN RELEASED, SOME PAGES
        MAY BE COMPLETE, SOME HALF DONE, SOME JUST DRAFTS. MOST OF THE CONTENTS ARE JUST PLACEHOLDERS FOR NOW. WE ARE
        LOOKING FOR COLLABORATORS, ESPECIALLY CONTENT EDITORS.
      </section>
    </Layout>
  )
}
