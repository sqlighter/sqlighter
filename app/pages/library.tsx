//
// library.tsx
//

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { GetStaticProps } from "next"

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
import { ContentsGallery, QUILT_SIZES } from "../components/contentsgallery"
import { BiomarkerListItem } from "../components/listitems"
import { getSerializableContent } from "../lib/props"

interface LibraryPageProps {
  biomarkers: Biomarker[]

  topics: Topic[]

  posts: {
    date: string
    title: string
    id: string
  }[]

  locale: string
}

export default function LibraryPage({ biomarkers, posts, topics, locale }: LibraryPageProps) {
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
              <BiomarkerListItem key={biomarker.id} item={biomarker} />
            ))}
          </List>
        </Section>
      )}

      {posts && (
        <Section title="Articles">
          {posts.map(({ id, date, title }) => (
            <li key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <Date dateString={date} />
            </li>
          ))}
        </Section>
      )}
    </Layout>
  )
}

/** Static properties from biomarkers */
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // TODO filter topics by published status, sort by sort field or title
  let topics = Object.values(Topic.getContents(locale))
  topics = topics.map((topic) => {
    const serialized = getSerializableContent(topic, false)
    return { ...serialized, url: `/topics/${topic.id}` }
  })

  // TODO could group based on topic group or sort order, etc
  let biomarkers = Object.values(Biomarker.getBiomarkers(locale))
  biomarkers = biomarkers.filter((b) => b.status == "published")
  biomarkers = biomarkers.sort((a, b) => (a.title < b.title ? -1 : 1))
  biomarkers = biomarkers.map((biomarker) => getSerializableContent(biomarker, false))

  const posts = getSortedPostsData()

  return { props: { topics, biomarkers, posts, locale } }
}
