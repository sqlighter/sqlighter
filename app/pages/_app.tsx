//
// app.tsx
//

import { useState, useEffect } from "react"

import Head from "next/head"
import Script from "next/script"
import { useRouter } from "next/router"

import CssBaseline from "@mui/material/CssBaseline"
import { styled, createTheme, ThemeProvider } from "@mui/material/styles"

import utilStyles from "../styles/global.scss"
import { useUser } from "../lib/auth/hooks"
import { Context } from "../components/context"
import { getGoogleSigninClient } from "../components/signin"
import { theme } from "../components/theme"

// https://bareynol.github.io/mui-theme-creator/
const theme2 = createTheme({
  components: {
    MuiAppBar: {
    },
  },

  palette: {
    primary: {
      light: "#e5eefb",
      main: "#3871e0",
      dark: "#284da0",
    },
    secondary: {
      light: "#58c0a7",
      main: "#387e6e",
    },
    background: {
      /*   paper: "#fF00FF", */
    },
    text: {
      primary: "#3d4043",
      secondary: "#606367",
    },
    action: {
      active: "#001E3C",
    },
    success: {
      500: "#009688",
    },
  },
})

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
      client_id: "427320365950-75nnbuht76pb6femtq9ccctqhs0a4qbb.apps.googleusercontent.com",
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

  return (
    <>
      <CssBaseline>
        <ThemeProvider theme={theme2}>
          <Context.Provider value={context}>
            <Head>
              <meta name="viewport" content="initial-scale=1, width=device-width" />
              <meta name="user" content={user?.id} />
            </Head>
            <Component {...pageProps} />
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
