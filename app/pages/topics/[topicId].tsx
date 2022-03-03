//
// /topics/[topicId].tsx - topic detail page
//

import { GetStaticProps, GetStaticPaths } from "next"
import { ContentPage } from "../../components/contentpage"
import { Topic } from "../../lib/topics"
import { getSerializableContent } from "../../lib/props"

export default function TopicPage({ item }: { item: Topic }) {
  return <ContentPage item={item} />
}

/** Create a page for each available topic in each locale */
export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths = []
  for (const locale of locales) {
    for (const topic of Object.values(await Topic.getContents(locale))) {
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
    // fallback to non-localized content if needed
    const topic = await Topic.getContent(topicId, locale, true)
    const item = await getSerializableContent(topic, true, true)
    return { props: { item } }
  } catch (exception) {
    // no format string because topicId is externally controlled user data
    console.error("getStaticProps - /topic/%s, exception: %s", exception, exception)
    throw exception
  }
}
