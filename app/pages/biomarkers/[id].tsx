//
// biomarkerPage - detail page for biomarker
//

import Layout from "../../components/layout"
import Head from "next/head"
import Image from "next/image"
import rbc from "../../public/images/rbc.jpeg"
import Date from "../../components/date"
import utilStyles from "../../styles/utils.module.css"
import { GetStaticProps, GetStaticPaths } from "next"

import List from "@mui/material/List"
import Typography from "@mui/material/Typography"

import { Biomarker } from "../../lib/biomarkers"
import { remark } from "remark"
import html from "remark-html"

import { ReferenceListItem } from "../../components/listitems"
import { Section } from "../../components/section"

export default function BiomarkerDetail({ biomarker }: { biomarker: any }) {
  const referencesTitle = `References`
  const referencesSubtitle = `Learn more on ${biomarker.title}`

  return (
    <Layout title={biomarker.title} subtitle={biomarker.description} back={true}>
      <article id={biomarker.id} title={biomarker.title}>
        {biomarker.contentHtml && (
          <section>
            <div className="markdown" dangerouslySetInnerHTML={{ __html: biomarker.contentHtml }} />
          </section>
        )}

        {biomarker.references && (
            <Section title="References">
              <List dense disablePadding>
                {biomarker.references.map((ref) => (
                  <ReferenceListItem key={ref.url} reference={ref} />
                ))}
              </List>
            </Section>
        )}
      </article>
    </Layout>
  )
}

/** Create a page for each available biomarker */
export const getStaticPaths: GetStaticPaths = ({ locales }) => {
  const paths = []
  for (const locale of locales) {
    for (const biomarker of Object.values(Biomarker.getBiomarkers(locale))) {
      if (biomarker.status == "published") {
        for (const locale of locales) {
          paths.push({ params: { id: biomarker.id }, locale })
        }
      }
    }
  }
  return {
    paths,
    fallback: "blocking",
  }
}

/** Static properties from /contents/biomarkers/ */
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const biomarker = Biomarker.getBiomarker(params.id as string, locale)
  try {
    const serializable = JSON.parse(JSON.stringify(biomarker))

    // Use remark to convert markdown into HTML string
    let contentHtml = null
    if (typeof serializable.content == "string") {
      const processedContent = await remark().use(html).process(serializable.content)
      contentHtml = processedContent.toString()
      if (typeof contentHtml == "string") {
        contentHtml = contentHtml.replace(/\"images\//g, '"/api/contents/biomarkers/images/')
      }
    }

    // console.debug(`biomarkers.tsx - biomarkerId: ${biomarker.id}, locale: ${locale}`, serializable)
    return {
      props: {
        biomarker: { ...serializable, contentHtml },
      },
    }
  } catch (exception) {
    console.error(`biomarker.getStaticProps - error while processing biomarker: ${params.id}`, exception, biomarker)
    throw exception
  }
}
