//
// library.tsx
//

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { GetStaticProps, GetServerSideProps } from "next"

import List from "@mui/material/List"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

import { getSortedPostsData } from "../lib/posts"
import { Biomarker } from "../lib/biomarkers"
import { Topic } from "../lib/topics"
import Date from "../components/date"
import Layout from "../components/layout"
import { Section } from "../components/section"
import { BiomarkersList } from "../components/biomarkerslist"
import { ContentsGallery, QUILT_SIZES } from "../components/contentsgallery"
import { BiomarkerListItem } from "../components/listitems"

interface BrowsePageProps {
  biomarkers: Biomarker[]

  topics: Topic[]

  posts: {
    date: string
    title: string
    id: string
  }[]

  locale: string
}

export default function BrowsePage({ biomarkers, posts, topics, locale }: BrowsePageProps) {
  const subtitle = `${biomarkers.length} biomarkers`

  return (
    <Layout home title="Library" subtitle={subtitle}>
      {topics && (
        <Section title="Topics">
          <ContentsGallery items={topics} sizes={QUILT_SIZES} />
        </Section>
      )}

      {biomarkers && (
        <Section title="Biomarkers">
          <List dense disablePadding>
            {biomarkers.map((biomarker) => (
              <BiomarkerListItem item={biomarker} />
            ))}
          </List>
        </Section>
      )}

      {posts && <Section title="Articles">
      {posts.map(({ id, date, title }) => (
          <li key={id}>
            <Link href={`/posts/${id}`}>
              <a>{title}</a>
            </Link>
            <br />
            <Date dateString={date} />
          </li>
        ))}
        </Section>}

    </Layout>
  )
}

/** Static properties from biomarkers */
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let topics = Object.values(Topic.getContents(locale))
  topics = topics.map((topic) => {
    topic = JSON.parse(JSON.stringify(topic))
    return { ...topic, url: `/topics/${topic.id}` }
  })

  //console.log(topics)

  let biomarkers = Object.values(Biomarker.getBiomarkers(locale))
  //  console.log(biomarkers)

  //console.log(req.query)

  biomarkers = biomarkers.filter((b) => b.status == "published")
  biomarkers = biomarkers.sort((a, b) => (a.title < b.title ? -1 : 1))

  const serializable = biomarkers.map((b) => JSON.parse(JSON.stringify(b)))
  const posts = getSortedPostsData()

  return {
    props: {
      biomarkers: serializable,
      posts,
      locale,
      topics,
    },
  }
}
