//
// library.tsx
//

import * as React from "react"
import { GetStaticProps } from "next"
import List from "@mui/material/List"

import { Article } from "../lib/articles"
import { Biomarker } from "../lib/biomarkers"
import { Topic } from "../lib/topics"
import { getSerializableArticles, getSerializableBiomarkers, getSerializableTopics } from "../lib/props"
import Layout from "../components/layout"
import { Section } from "../components/section"
import { ContentsGallery, QUILT_SIZES } from "../components/contentsgallery"
import { ArticleListItem, BiomarkerListItem } from "../components/listitems"

interface LibraryPageProps {
  biomarkers: Biomarker[]
  topics: Topic[]
  articles: Article[]
  locale: string
}

export default function LibraryPage({ biomarkers, topics, articles }: LibraryPageProps) {
  return (
    <Layout home title="Library" subtitle={`${biomarkers.length} biomarkers`}>
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
