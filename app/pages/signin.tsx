import Layout from "../components/layout"
import Head from "next/head"
import Date from "../components/date"
import utilStyles from "../styles/utils.module.css"
import { GetStaticProps, GetStaticPaths } from "next"
import { Biomarker } from "../lib/biomarkers"
import Link from "next/link"
import Script from "next/script"

import jwt_decode from "jwt-decode"

function onGoogleSignin(response) {
  const jwtToken = response.credential
  var decoded = jwt_decode(jwtToken)
  console.log(`onGoogleSignin`, response, decoded)
}

async function onGoogleLoad(params) {
  const google = (window as any).google
  console.log(`onGoogleLoad`, params, google)

  google.accounts.id.initialize({
    client_id: "427320365950-75nnbuht76pb6femtq9ccctqhs0a4qbb.apps.googleusercontent.com",
    callback: onGoogleSignin,
  })

  // https://developers.google.com/identity/gsi/web/guides/personalized-button
  google.accounts.id.renderButton(
    document.getElementById("buttonDiv"),
    { theme: "outline", size: "large" } // customization attributes
  )

  // also display the One Tap dialog
  google.accounts.id.prompt()
}

export default function SigninPage({ biomarkers, locale }: { biomarkers: Biomarker[]; locale: string }) {
  return (
    <Layout>
      <Head>
        <title>Signin</title>
      </Head>

      <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" onLoad={onGoogleLoad} />

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <div id="buttonDiv"></div>
      </section>
    </Layout>
  )
}

/** Static properties from biomarkers.json */
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  return {
    props: {
      biomarkers: "ciao",
      locale,
    },
  }
}
/*

      <script src="https://accounts.google.com/gsi/client" onLoad={onGoogleSigninLoad} async defer></script>


<Script
src="https://accounts.google.com/gsi/client"
strategy="lazyOnload"
onLoad={(params) => {
  console.log(params)
  const google = (window as any).google
  console.log(google)

  function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential)
  }
  google.accounts.id.initialize({
    client_id: "427320365950-75nnbuht76pb6femtq9ccctqhs0a4qbb.apps.googleusercontent.com",
    callback: handleCredentialResponse,
  })
  google.accounts.id.renderButton(
    document.getElementById("buttonDiv"),
    { theme: "outline", size: "large" } // customization attributes
  )
  google.accounts.id.prompt() // also display the One Tap dialog
}}
/>

*/
