import Layout from "../components/layout"
import Head from "next/head"
import utilStyles from "../styles/utils.module.css"

export default function PrivacyPolicyPage(props) {
  return (
    <Layout>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <h2>Privacy Policy</h2>
      <p>
        This site uses <a href="https://developers.google.com/identity/gsi/web">Google Identity Services</a> for the
        purpose of signing you in without having to handle or store your credentials. Data provided to this site is
        exclusively used to support signing in and is not passed to any third party services, other than for the
        purposes of authentication.
      </p>
    </Layout>
  )
}
