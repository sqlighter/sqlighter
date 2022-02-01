import Layout from "../../components/layout"
import Head from "next/head"
import Date from "../../components/date"
import utilStyles from "../../styles/utils.module.css"
import { GetStaticProps, GetStaticPaths } from "next"
import { Biomarker } from "../../lib/biomarkers"
import Link from "next/link"

export default function BiomarkersPage({ biomarkers }: { biomarkers: Biomarker[] }) {
  return (
    <Layout>
      <Head>
        <title>Biomarkers</title>
      </Head>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {biomarkers.map((biomarker) => (
            <li className={utilStyles.listItem} key={biomarker.id}>
              <Link href={`/biomarkers/${biomarker.id}`}>
                <a>{biomarker.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

/** Static properties from biomarkers.json */
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const biomarkers = Object.values(Biomarker.getBiomarkers(locale))
  const serializable = biomarkers.map((b) => JSON.parse(JSON.stringify(b)))
  console.debug(serializable)
  return {
    props: {
      biomarkers: serializable,
    },
  }
}
