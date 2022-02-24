//
// app.tsx
//

import Head from "next/head"
import Script from "next/script"
import { useRouter } from "next/router"
import "../styles/global.css"

import { useState } from "react"
import CssBaseline from "@mui/material/CssBaseline"
import GlobalStyles from "@mui/material/GlobalStyles"
import { ThemeProvider } from "@mui/material/styles"
import Box from "@mui/material/Box"

import { useUser } from "../lib/auth/hooks"
import { Context } from "../components/context"
import { getGoogleSigninClient } from "../components/signin"
import { customTheme, PRIMARY_LIGHTEST } from "../components/theme"

// TODO google public id used to signin from environment variables
// https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
// const GOOGLE_ID = process.env['NEXT_PUBLIC_GOOGLE_ID']
const GOOGLE_ID = "427320365950-75nnbuht76pb6femtq9ccctqhs0a4qbb.apps.googleusercontent.com"
//console.log('GOOGLE_ID: ' + GOOGLE_ID)
//console.assert(GOOGLE_ID, JSON.stringify(process.env))

export default function App({ Component, pageProps }) {
  // current page, navigation, etc
  const router = useRouter()

  // retrieve user information from current session
  const [user, { mutate: mutateUser, loading: userLoading }] = useUser()

  // true if google signin script has lazy loaded and has been initialized, i.e. is active
  const [isGoogleSigninLoaded, setGoogleSigninLoaded] = useState(false)

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
        mutateUser({ data: user }, false)
      })
    })
  }

  /** Sign out of Google and local sessions, disable session cookie */
  function signout(redirectUrl?: string): void {
    const gsi = getGoogleSigninClient()
    if (gsi) {
      gsi.disableAutoSelect()
    }
    fetch("/api/signout").then((res) => {
      mutateUser()
      if (redirectUrl) {
        router.push(redirectUrl)
      }
    })
  }

  /** Initialize Google Signin with client id credentials */
  async function onGoogleSigninLoaded(params) {
    // https://developers.google.com/identity/gsi/web/reference/js-reference#IdConfiguration
    const gsi = getGoogleSigninClient()
    gsi.initialize({
      client_id: "427320365950-75nnbuht76pb6femtq9ccctqhs0a4qbb.apps.googleusercontent.com" /*GOOGLE_ID,*/,
      callback: onSignin,
      auto_select: true,
    })
    setGoogleSigninLoaded(true)
  }

  //
  // Context that is shared will all app components includes user, status, callbacks, etc.
  //

  const context = {
    // undefined while user is loading or google signin script is loading
    user: isGoogleSigninLoaded && user,

    // true once google signin has been initialized
    isGoogleSigninLoaded,

    // signout + redirect callback
    signout,
  }

  // <GlobalStyles styles={{ body: { backgroundColor: PRIMARY_LIGHTEST } }} />
  // is used to that you don't see a white strip when you pull the header down
  // we then give all contents a default of background.paper so it's all white as base

  return (
    <>
      <CssBaseline>
        <GlobalStyles styles={{ body: { backgroundColor: PRIMARY_LIGHTEST } }} />
        <ThemeProvider theme={customTheme()}>
          <Context.Provider value={context}>
            <Head>
              <meta name="viewport" content="initial-scale=1, width=device-width" />
              <meta name="user" content={user?.id} />
              <meta name="theme-color" content={PRIMARY_LIGHTEST} />

              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
              <link
                href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap"
                rel="stylesheet"
              />
            </Head>
            <Box sx={{ backgroundColor: "background.paper", top: 0, bottom: 0 }}>
              <Component {...pageProps} />
            </Box>
            <Script
              key="google-signin"
              src="https://accounts.google.com/gsi/client"
              strategy="lazyOnload"
              onLoad={onGoogleSigninLoaded}
            />
          </Context.Provider>
        </ThemeProvider>
      </CssBaseline>
    </>
  )
}
