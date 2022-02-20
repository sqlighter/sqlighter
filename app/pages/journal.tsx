//
// journal.tsx
//

import { GetStaticProps } from "next"
import Head from "next/head"
import Link from "next/link"

import * as React from "react"

import { getSortedPostsData } from "../lib/posts"
import Layout from "../components/layout"
import Date from "../components/date"

interface JournalPageProps {
  //
}

export default function JournalPage(props: JournalPageProps) {
  return (
    <Layout title="Journal" subtitle="Track your progress">
      <section>tbd: Journal goes here</section>
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
