//
// biomarkerPage - detail page for biomarker
//

import { GetStaticProps, GetStaticPaths } from "next"
import { remark } from "remark"
import html from "remark-html"

import Box from "@mui/material/Box"
import List from "@mui/material/List"
import Typography from "@mui/material/Typography"

import Layout from "../../components/layout"
import { Biomarker } from "../../lib/biomarkers"
import { ReferenceListItem } from "../../components/listitems"
import { Section } from "../../components/section"
import { Topic } from "../../lib/topics"
import { ContentPage } from "../../components/contentpage"

interface TopicPageProps {
  item: Topic
}

export default function TopicPage({ item }: TopicPageProps) {
  return <ContentPage item={item} />
}

/** Create a page for each available topic */
export const getStaticPaths: GetStaticPaths = ({ locales }) => {
  const paths = []
  for (const locale of locales) {
    for (const topic of Object.values(Topic.getContents(locale))) {
      if (topic.status == "published") {
        for (const locale of locales) {
          paths.push({ params: { id: topic.id }, locale })
        }
      }
    }
  }
  return {
    paths,
    fallback: "blocking",
  }
}

/** Convert to basic object to next.js doesn't complain when we pass props to the client */
function serializableProps(props: any) {
  return JSON.parse(JSON.stringify(props))
}

/** Static properties from /topics/id */
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const item = Topic.getContent(params.id as string, locale, true)
  try {
    const props = { item }
    // console.debug(`biomarkers.tsx - biomarkerId: ${biomarker.id}, locale: ${locale}`, serializable)
    return { props: serializableProps(props) }
  } catch (exception) {
    console.error(`biomarker.getStaticProps - error while processing biomarker: ${params.id}`, exception, item)
    throw exception
  }
}
