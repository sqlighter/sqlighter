import { useState, useEffect } from "react"

import Head from "next/head"
import Script from "next/script"
import { useRouter } from "next/router"

import CssBaseline from "@mui/material/CssBaseline"

import "../styles/global.css"
import { useUser } from "../lib/auth/hooks"
import { Context } from "../components/context"

export default function App({ Component, pageProps }) {
  const router = useRouter()

  //
  // Google Signin and User status methods
  //

  // retrieve user information from current session
  const [user, { mutate: mutateUser, loading: userLoading }] = useUser()

  // true if google signin script has lazy loaded and has been initialized, i.e. is active
  const [isGoogleSigninLoaded, setGoogleSigninLoaded] = useState(false)

  //console.log("_app props" + JSON.stringify(pageProps))

  /** Asks Google Signin to display Google one tap dialog or to automatically sign in */
  function promptSignin() {
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
  function onSignin(response) {
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
  function signout(redirectUrl?: string): void {
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
      callback: onSignin,
      auto_select: true,
    })

    // https://developers.google.com/identity/gsi/web/guides/personalized-button
    google.accounts.id.renderButton(
      document.getElementById("googleSigninButton"),
      { theme: "outline", size: "large", shape: "pill" } // customization attributes
    )

    setGoogleSigninLoaded(true)
  }

  useEffect(() => {
    console.log(`isGoogleSigninLoaded: ${isGoogleSigninLoaded}, userLoading: ${userLoading}, user: ${user}`)
    if (isGoogleSigninLoaded && userLoading == false && user == null) {
      console.log("prompting...")
      promptSignin()
    }
  })

  //
  // Context that is shared will all app components includes user, status, callbacks, etc.
  //

  const context = {
    // undefined while user is loading
    user: userLoading ? undefined : user,
    // signout + redirect callback
    signout,
  }

  return (
    <>
      <CssBaseline>
        <Context.Provider value={context}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
            <meta name="user" content={user?.id} />
          </Head>
          user: {user?.id}
          <Component {...pageProps} />
          <Script
            key="google-signin"
            src="https://accounts.google.com/gsi/client"
            strategy="lazyOnload"
            onLoad={onGoogleLoaded}
          />
        </Context.Provider>
      </CssBaseline>
    </>
  )
}
