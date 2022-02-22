//
// [topicId].tsx - topic detail page
//

import { GetStaticProps, GetStaticPaths } from "next"
import { ContentPage } from "../../components/contentpage"
import { Topic } from "../../lib/topics"
import { getSerializableContent } from "../../lib/props"

interface TopicPageProps {
  item: Topic
}

export default function TopicPage({ item }: TopicPageProps) {
  return <ContentPage item={item} />
}

/** Create a page for each available topic in each locale */
export const getStaticPaths: GetStaticPaths = ({ locales }) => {
  const paths = []
  for (const locale of locales) {
    for (const topic of Object.values(Topic.getContents(locale))) {
      if (topic.status == "published") {
        paths.push({ params: { topicId: topic.id }, locale })
      }
    }
  }
  return { paths, fallback: "blocking" }
}

/** Static properties from /topics/topicId */
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const topicId = params.topicId as string
  try {
    const topic = Topic.getContent(topicId, locale, true)
    const item = getSerializableContent(topic, true)
    return { props: { item } }
  } catch (exception) {
    console.error(`getStaticProps - /topic/${topicId}, exception: ${exception}`, exception)
    throw exception
  }
}
