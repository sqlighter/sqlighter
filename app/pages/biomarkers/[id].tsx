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
import { Biomarker } from "../../lib/biomarkers"
import { remark } from "remark"
import html from "remark-html"

import { Section } from "../../components/section"

export default function BiomarkerDetail({ biomarker }: { biomarker: any }) {
  return (
    <Layout title={biomarker.title}>
      <article>
        <Section title={biomarker.title} subtitle={biomarker.description}>
          <div dangerouslySetInnerHTML={{ __html: biomarker.contentHtml }} />
          <div className={utilStyles.lightText}>{biomarker.id}</div>
        </Section>

        <Section title="Links" subtitle="Learn more">
          <div dangerouslySetInnerHTML={{ __html: biomarker.contentHtml }} />
          <div className={utilStyles.lightText}>{biomarker.id}</div>
        </Section>

        <br />
        <Image src={rbc} alt="Red blood cells" />
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

/** Static properties from biomarkers.json */
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const biomarker = Biomarker.getBiomarker(params.id as string, locale)
  const serializable = JSON.parse(JSON.stringify(biomarker))

  // Use remark to convert markdown into HTML string
  const processedContent = await remark().use(html).process(serializable.content)
  const contentHtml = processedContent.toString()

  // console.debug(`biomarkers.tsx - biomarkerId: ${biomarker.id}, locale: ${locale}`, serializable)
  return {
    props: {
      biomarker: { ...serializable, contentHtml },
    },
  }
}
