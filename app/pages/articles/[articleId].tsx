//
// /articles/[articleId].tsx - article detail page
//

import { GetStaticProps, GetStaticPaths } from "next"
import { ContentPage } from "../../components/contentpage"
import { Article } from "../../lib/articles"
import { getSerializableContent } from "../../lib/props"

export default function ArticlePage({ item }: { item: Article }) {
  return <ContentPage item={item} />
}

/** Create a page for each available article in each locale */
export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths = []
  for (const locale of locales) {
    for (const article of Object.values(await Article.getContents(locale))) {
      if (article.status == "published") {
        paths.push({ params: { articleId: article.id }, locale })
      }
    }
  }
  return { paths, fallback: "blocking" }
}

/** Static properties from /articles/articleId */
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const articleId = params.articleId as string
  try {
    // fallback to non-localized content if needed
    const topic = await Article.getContent(articleId, locale, true)
    const item = await getSerializableContent(topic, true, true)
    return { props: { item } }
  } catch (exception) {
    console.error("getStaticProps - /article/%s, exception: %s", articleId, exception, exception)
    throw exception
  }
}
