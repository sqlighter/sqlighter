//
// library.tsx - placeholder
//

import * as React from "react"
import { useRouter } from "next/router"
import { GetStaticProps } from "next"
import Box from "@mui/material/Box"

import { AppLayout } from "../components/layouts"

// Monitor performance here:
// https://pagespeed.web.dev/report?url=https%3A%2F%2Fbiomarkers.app%2Flibrary&hl=en-US

interface LibraryPageProps {
  //
}

export default function LibraryPage(props: LibraryPageProps) {
  const router = useRouter()

  return (
    <AppLayout title="Library" description="420 topics of interest">
      {router.query.search && <Box>search: {router.query.search}</Box>}
      TBD
    </AppLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {},
  }
}
