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

export default function BiomarkerDetail({ biomarker }: { biomarker: Biomarker }) {
  return (
    <Layout>
      <Head>
        <title>{biomarker.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{biomarker.title}</h1>
        <h2 className={utilStyles.headingMd}>{biomarker.description}</h2>
        <div dangerouslySetInnerHTML={{ __html: biomarker.contentHtml }} />
        <br />
        <div className={utilStyles.lightText}>{biomarker.id}</div>
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
  serializable.contentHtml = processedContent.toString()

  console.debug(`biomarkers.tsx - biomarkerId: ${biomarker.id}, locale: ${locale}`, serializable)
  return {
    props: {
      biomarker: serializable,
    },
  }
}
