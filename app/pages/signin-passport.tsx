import Layout from "../components/layout"
import Head from "next/head"
import Date from "../components/date"
import utilStyles from "../styles/utils.module.css"
import { GetStaticProps, GetStaticPaths } from "next"
import { Biomarker } from "../lib/biomarkers"
import Link from "next/link"
import Script from "next/script"
import { useUser } from "../lib/auth/hooks"

export default function SigninPage({ biomarkers, locale }: { biomarkers: Biomarker[]; locale: string }) {
  const [user, { mutate, loading }] = useUser()

  return (
    <Layout>
      <Head>
        <title>Signin</title>
      </Head>
      <div>
        loading: {loading ? "true" : "false"}
        <br />
      </div>

      {user && <div>you are logged in</div>}
      {!user && (
        <div>
          you are NOT logged in
          <div
            id="g_id_onload"
            data-client_id="427320365950-75nnbuht76pb6femtq9ccctqhs0a4qbb.apps.googleusercontent.com"
            data-context="signin"
            data-ux_mode="popup"
            data-login_uri="/api/callback/google-one-tap"
            data-auto_select="true"
          ></div>
          <div
            className="g_id_signin"
            data-type="standard"
            data-shape="rectangular"
            data-theme="outline"
            data-text="signin_with"
            data-size="large"
            data-logo_alignment="left"
          ></div>
        </div>
      )}

      <p>
        <a href="/logout" role="button" className="outline">
          Logout
        </a>
      </p>
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
