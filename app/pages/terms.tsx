import Layout from "../components/layout"
import Head from "next/head"
import utilStyles from "../styles/utils.module.css"

export default function TermsPage(props) {
  return (
    <Layout>
      <Head>
        <title>Terms &amp; Conditions</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        Terms and Conditions, this site is under construction.
      </section>
    </Layout>
  )
}
