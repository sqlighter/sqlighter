//
// library.tsx
//

import * as React from "react"
import { useRouter } from "next/router"
import { GetStaticProps } from "next"
import Box from "@mui/material/Box"
import List from "@mui/material/List"

import { Article } from "../lib/articles"
import { Biomarker } from "../lib/biomarkers"
import { Topic } from "../lib/topics"
import { getSerializableArticles, getSerializableBiomarkers, getSerializableTopics } from "../lib/props"

import Layout from "../components/layout"
import { Section } from "../components/section"
import { ContentsGallery, QUILT_SIZES } from "../components/contentsgallery"
import { ArticleListItem, BiomarkerListItem, TopicListItem } from "../components/listitems"

// Monitor performance here:
// https://pagespeed.web.dev/report?url=https%3A%2F%2Fbiomarkers.app%2Flibrary&hl=en-US

interface LibraryPageProps {
  biomarkers: Biomarker[]
  topics: Topic[]
  articles: Article[]
  locale: string
}

export default function LibraryPage({ biomarkers, topics, articles }: LibraryPageProps) {
  const router = useRouter()

  return (
    <Layout home title="Library" subtitle={`${biomarkers.length} biomarkers`} search={true}>
      {router.query.search && <Box>search: {router.query.search}</Box>}

      {topics && (
        <Section title="Topics">
          <ContentsGallery items={topics} sizes={QUILT_SIZES} />
        </Section>
      )}

      {false && (
        <Section title="Topics">
          <List dense disablePadding>
            {topics.map((topic) => (
              <TopicListItem key={topic.id} item={topic} />
            ))}
          </List>
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

      {articles && (
        <Section title="Articles">
          <List dense disablePadding>
            {articles.map((article) => (
              <ArticleListItem key={article.id} item={article} />
            ))}
          </List>
        </Section>
      )}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      topics: getSerializableTopics(locale),
      biomarkers: getSerializableBiomarkers(locale),
      articles: getSerializableArticles(locale),
      locale,
    },
  }
}
