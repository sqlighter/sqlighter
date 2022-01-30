import Layout from "../../components/layout"
import Head from "next/head"
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
      </article>
    </Layout>
  )
}

function getTranslation(item: any, key: string): string {
  return item?.translations?.[0][key]
}

/** Create a page for each available biomarker */
export const getStaticPaths: GetStaticPaths = () => {
  const paths = Biomarker.getBiomarkers().map((b) => {
    return { params: { id: b.id } }
  })
  return {
    paths,
    fallback: false,
  }
}

/** Static properties from biomarkers.json */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const biomarker = Biomarker.getBiomarker(params.id as string)
  const serializable = JSON.parse(JSON.stringify(biomarker))
  console.debug(`biomarkers.tsx - biomarkerId: ${biomarker.id}`, serializable)
  return {
    props: {
      biomarker: serializable,
    },
  }
}
