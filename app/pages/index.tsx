//
// index.tsx - home page
//

import { GetStaticProps } from "next"
import Image from "next/image"
import Box from "@mui/material/Box"

import Layout from "../components/layout"

export default function Home({ props }) {
  return (
    <Layout title="Biomarkers" home>
      <Image priority src="/images/profile.jpg" className="round" height={144} width={144} alt="Biomarkers" />
      <Box>tbd: home page goes here</Box>
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
