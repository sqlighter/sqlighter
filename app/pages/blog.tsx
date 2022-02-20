//
//
//

import { GetStaticProps } from "next"
import * as React from "react"

import { getSortedPostsData } from "../lib/posts"
import Layout from "../components/layout"
import { Section } from "../components/section"
import Date from "../components/date"

interface BlogPageProps {
  // list of posts ordered by date
  posts: { date: string; title: string; id: string }[]
  // locale, eg en-US, it-IT
  locale: string
}

export default function BlogPage({ posts }: BlogPageProps) {
  return (
    <Layout home title="Blog">
      {posts.map(({ id, date, title }) => (
        <Section title={title} subtitle={<Date dateString={date} />}> </Section>
      ))}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const posts = getSortedPostsData()
  return {
    props: {
      posts,
      locale,
    },
  }
}
