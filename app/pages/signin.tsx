import Layout from "../components/layout"
import Head from "next/head"
import Date from "../components/date"
import utilStyles from "../styles/utils.module.css"
import { GetStaticProps, GetStaticPaths } from "next"
import { Biomarker } from "../lib/biomarkers"
import Link from "next/link"
import Script from "next/script"

import jwt_decode from "jwt-decode"

// https://console.developers.google.com/apis/credentials/oauthclient/427320365950-75nnbuht76pb6femtq9ccctqhs0a4qbb.apps.googleusercontent.com?project=insieme2

function signOut() {
  const google = (window as any).google
}

function onGoogleSignin(response) {
  const jwtToken = response.credential
  // https://developers.google.com/identity/gsi/web/reference/js-reference#CredentialResponse
  var header = jwt_decode(jwtToken)
  var payload = jwt_decode(jwtToken, { header: true })
  console.log(`onGoogleSignin`, response, header, payload)
}

function promptGoogle() {
  const google = (window as any).google
  // also display the One Tap dialog
  google.accounts.id.prompt((notification) => {
    console.log(`google.accounts.id.prompt`, notification)
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      // https://developers.google.com/identity/gsi/web/reference/js-reference#PromptMomentNotification
      // continue with another identity provider.
    }
  })
}

function signoutGoogle() {
  const google = (window as any).google
  google.accounts.id.disableAutoSelect()
}

async function onGoogleLoad(params) {
  const google = (window as any).google
  console.log(`onGoogleLoad`, params, google)
  google.accounts.id.initialize({
    client_id: "427320365950-75nnbuht76pb6femtq9ccctqhs0a4qbb.apps.googleusercontent.com",
    callback: onGoogleSignin,
    auto_select: true,
  })

  // https://developers.google.com/identity/gsi/web/guides/personalized-button
  google.accounts.id.renderButton(
    document.getElementById("buttonDiv"),
    { theme: "outline", size: "large" } // customization attributes
  )

  // also display the One Tap dialog
  google.accounts.id.prompt((notification) => {
    console.log(`google.accounts.id.prompt`, notification)
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      // https://developers.google.com/identity/gsi/web/reference/js-reference#PromptMomentNotification
      // continue with another identity provider.
    }
  })
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile()
  console.log("ID: " + profile.getId()) // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName())
  console.log("Image URL: " + profile.getImageUrl())
  console.log("Email: " + profile.getEmail()) // This is null if the 'email' scope is not present.
}

export default function SigninPage({ biomarkers, locale }: { biomarkers: Biomarker[]; locale: string }) {
  return (
    <Layout>
      <Head>
        <title>Signin</title>
        <meta
          name="google-signin-client_id"
          content="427320365950-75nnbuht76pb6femtq9ccctqhs0a4qbb.apps.googleusercontent.com"
        />
      </Head>

      <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" onLoad={onGoogleLoad} />

      <div className="g-signin2" data-onsuccess="onSignIn"></div>

      <div className="g_id_signout">Sign Out</div>

      <button onClick={promptGoogle}>ask google</button>

      <button onClick={signoutGoogle}>SignOut</button>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <div id="buttonDiv"></div>
      </section>

      <div className="g_id_signout">Sign Out</div>
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
