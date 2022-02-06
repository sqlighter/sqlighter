import Head from "next/head"
import Script from "next/script"
import { useRouter } from "next/router"
import "../styles/global.css"
import { useUser } from "../lib/auth/hooks"

import { Context } from "../components/context"

export default function App({ Component, pageProps }) {
  // retrieve user information from current session
  const [user, { mutate: mutateUser, loading: userLoading }] = useUser()
  const router = useRouter()
  console.log("_app props" + JSON.stringify(pageProps))

  function promptSignIn() {
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

  /**
   * Called by Google sign in when credentials check is completed.
   * To complete the sign up or sign in procedure we pass the jwt
   * token we just received from Google to our server side. Passport
   * will authenticate the token, create a local session cookie and
   * return the User object that was retrieve or created.
   */
  function onSignIn(response) {
    // https://developers.google.com/identity/gsi/web/reference/js-reference#CredentialResponse
    // import jwt_decode from "jwt-decode"
    // const jwtToken = response.credential
    // var header = jwt_decode(jwtToken)
    // console.log(`onGoogleSignin`, response, header, payload)
    fetch("/api/callback/google-one-tap", {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "credential=" + response.credential,
      method: "post",
    }).then((res) => {
      res.json().then((json) => {
        const user = json.data
        console.log("onSignIn", user)
        mutateUser(user)
      })
    })
  }

  /** Sign out of Google and local sessions, disable session cookie */
  function signOut(redirectUrl?: string): void {
    const google = (window as any).google
    google.accounts.id.disableAutoSelect()
    fetch("/api/signout").then((res) => {
      mutateUser()
      if (redirectUrl) {
        router.push(redirectUrl)
      }
    })
  }

  async function onGoogleLoaded(params) {
    const google = (window as any).google
    console.log(`onGoogleLoad`, params, google)
    google.accounts.id.initialize({
      client_id: "427320365950-75nnbuht76pb6femtq9ccctqhs0a4qbb.apps.googleusercontent.com",
      callback: onSignIn,
      auto_select: true,
    })

    // https://developers.google.com/identity/gsi/web/guides/personalized-button
    google.accounts.id.renderButton(
      document.getElementById("googleSignInButton"),
      { theme: "outline", size: "large", shape: "pill" } // customization attributes
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

  // context that is shared will all app components includes user, status, etc.
  const context = {
    user,
    signOut,
  }

  return (
    <>
      <Context.Provider value={context}>
        <Head>
          <meta name="user" content={user?.id} />
        </Head>
        <Component {...pageProps} />
        <Script
          key="google-signin"
          src="https://accounts.google.com/gsi/client"
          strategy="lazyOnload"
          onLoad={onGoogleLoaded}
        />
      </Context.Provider>
    </>
  )
}

/*



        <section>
          <SignInButton />
        </section>
        <button onClick={promptSignIn}>ask google</button>

        <div
          className="g_id_signin"
          data-type="standard"
          data-shape="pill"
          data-theme="outline"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left"
        ></div>

        <button onClick={(event) => signOut()}>SignOut</button>
        <div>
          Loading? {userLoading ? "true" : "false"}
          User: {user ? JSON.stringify(user) : ""}
        </div>



        */
