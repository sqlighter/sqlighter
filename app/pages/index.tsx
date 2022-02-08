import Head from "next/head"
import Image from "next/image"
import Layout from "../components/layout"
import utilStyles from "../styles/utils.module.css"
import { getSortedPostsData } from "../lib/posts"
import Link from "next/link"
import Date from "../components/date"
import { GetStaticProps } from "next"

export default function Home({ props }) {
  return (
    <Layout home>
      <Image
        priority
        src="/images/profile.jpg"
        className={utilStyles.borderCircle}
        height={144}
        width={144}
        alt="Biomarkers"
      />
      <h1 className={utilStyles.heading2Xl}>Biomarkers v3</h1>
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
