//
// index.tsx - home page
//

import { GetStaticProps } from "next"
import Image from "next/image"
import Box from "@mui/material/Box"
import Layout from "../components/layout"

export default function Home({ props }) {
  return (
    <Layout subtitle="Know better, live better" home>
      <Image priority src="/images/profile.jpg" className="round" height={144} width={144} alt="Biomarkers" />
      <Box>
        THIS IS WORK IN PROGRESS. THE DEPLOYED APPLICATION IS NOT AT ALL COMPLETE, HAS NOT YET BEEN RELEASED, SOME PAGES
        MAY BE COMPLETE, SOME HALF DONE, SOME JUST DRAFTS. MOST OF THE CONTENTS ARE JUST PLACEHOLDERS FOR NOW. WE ARE
        LOOKING FOR COLLABORATORS, ESPECIALLY CONTENT EDITORS.
      </Box>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      //
    },
  }
}
