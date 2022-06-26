//
// app.tsx - main component used to wrap all page components and keep state, handle shared tasks, etc
//

import Head from "next/head"
import Script from "next/script"
import { useRouter } from "next/router"

// allotment styles + global overrides
import "allotment/dist/style.css"
import "../public/styles.css"

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { useState } from "react"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"

import { useUser } from "../components/hooks/useuser"
import { Command } from "../lib/commands"
import { Context } from "../components/context"
import { getGoogleSigninClient, promptSignin } from "../components/signin"
import { customTheme, PRIMARY_LIGHTEST } from "../components/theme"

// Google client id used for signin client is bound below at build time
// https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
// const GOOGLE_ID = "xxxx.apps.googleusercontent.com" // workaround for google cloud build issues
const GOOGLE_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

interface AppProps {
  //
}

export default function App({ Component, pageProps }: { Component: any; pageProps: AppProps }) {
  // current page, navigation, etc
  const router = useRouter()

  // retrieve user information from current session
  const [user, { mutate: mutateUser }] = useUser()

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
        // console.log("onSignIn", user)
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
      client_id: GOOGLE_ID,
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

  //
  // handlers
  //

  function handleCommand(event: React.SyntheticEvent, command: Command) {
    // console.debug(`App.handleCommand - command: ${command.command}`, command)
    switch (command.command) {
      case "openSignin":
        promptSignin()
        break
    }
  }

  //
  // render
  //

  return (
    <>
      <CssBaseline>
        <ThemeProvider theme={customTheme()}>
          <Context.Provider value={context}>
          <DndProvider backend={HTML5Backend}>
            <Head>
              <meta name="viewport" content="initial-scale=1, width=device-width" />
              <meta name="user" content={user?.id} />
              <meta name="theme-color" content={PRIMARY_LIGHTEST} />
              <meta name="google_id" content={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </Head>
            <Component {...pageProps} user={user} onCommand={handleCommand} />
            <Script
              key="google-signin"
              src="https://accounts.google.com/gsi/client"
              strategy="lazyOnload"
              onLoad={onGoogleSigninLoaded}
            />
            {/* Global Site Tag (gtag.js) - Google Analytics */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
            </DndProvider>
          </Context.Provider>
        </ThemeProvider>
      </CssBaseline>
    </>
  )
}
