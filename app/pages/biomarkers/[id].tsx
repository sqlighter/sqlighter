import Layout from "../../components/layout"
import Head from "next/head"
import Image from "next/image"
import rbc from "../../public/images/rbc.jpeg"
import Date from "../../components/date"
import utilStyles from "../../styles/utils.module.css"
import { GetStaticProps, GetStaticPaths } from "next"
import { Biomarker } from "../../lib/biomarkers"

export default function BiomarkerDetail({ biomarker }: { biomarker: Biomarker }) {
  return (
    <Layout>
      <Head>
        <title>{getTranslation(biomarker, "name")}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{getTranslation(biomarker, "name")}</h1>
        <br />
        {getTranslation(biomarker, "description")}
        <br />
        {getTranslation(biomarker, "summary")}
        <br />
        <div className={utilStyles.lightText}>{biomarker.id}</div>
        <br />
        <Image src={rbc} alt="Red blood cells" />
      </article>
    </Layout>
  )
}

function getTranslation(item: any, key: string): string {
  return item?.translations?.[0][key]
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
  console.debug(`biomarkers.tsx - biomarkerId: ${biomarker.id}, locale: ${locale}`, serializable)
  return {
    props: {
      biomarker: serializable,
    },
  }
}
