//
// /biomarkers/[biomarkerId].tsx - biomarker detail page
//

import { GetStaticProps, GetStaticPaths } from "next"
import { ContentPage } from "../../components/contentpage"
import { Biomarker } from "../../lib/items/biomarkers"
import { getSerializableContent } from "../../lib/props"

export default function BiomarkerPage({ item }: { item: Biomarker }) {
  return <ContentPage item={item} />
}

/** Create a page for each available biomarker in each locale */
export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths = []
  for (const locale of locales) {
    for (const topic of Object.values(await Biomarker.getBiomarkers(locale))) {
      if (topic.status == "published") {
        paths.push({ params: { biomarkerId: topic.id }, locale })
      }
    }
  }
  return { paths, fallback: "blocking" }
}

/** Static properties from /biomarkers/biomarkerId */
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const biomarkerId = params.biomarkerId as string
  try {
    // fallback to non-localized content if needed
    const topic = await Biomarker.getBiomarker(biomarkerId, locale) // TODO add true to fallback on non-localized
    const item = await getSerializableContent(topic, true, true)
    return { props: { item } }
  } catch (exception) {
    console.error("getStaticProps - /biomarker/%s, exception: %s", biomarkerId, exception, exception)
    throw exception
  }
}
