import Layout from "../components/layout"
import Head from "next/head"

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <h2>Privacy Policy</h2>
      <p>
        This site uses <a href="https://developers.google.com/identity/gsi/web">Google Identity Services</a> for the
        purpose of signing you in without having to handle or store your credentials. Data provided to this site is used
        exclusively to give personalized tips and recommendations and is never passed to any third party services.
      </p>
    </Layout>
  )
}
