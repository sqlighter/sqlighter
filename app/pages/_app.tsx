//
// app.tsx
//

import Head from "next/head"
import Script from "next/script"
import { useRouter } from "next/router"
import "../styles/global.css"

import { useState, useEffect } from "react"
import CssBaseline from "@mui/material/CssBaseline"
import GlobalStyles from "@mui/material/GlobalStyles"
import { createTheme, ThemeProvider, ThemeOptions } from "@mui/material/styles"
import { lighten } from "@mui/material/styles"
import Box from "@mui/material/Box"

import { useUser } from "../lib/auth/hooks"
import { Context } from "../components/context"
import { getGoogleSigninClient } from "../components/signin"
import { text } from "stream/consumers"

//
// Theming
// https://bareynol.github.io/mui-theme-creator/
// https://mui.com/customization/theming/
//

declare module "@mui/material/styles" {
  // allow configuration using `createTheme`
  interface PaletteOptions {
    materialyou?: {
      primary?: {
        light?: string
        lighter?: string
        lightest?: string
      }
    }
  }
}

// coefficients used to make colors lighter
const LIGHT = 0.92
const LIGHTER = 0.95
const LIGHTEST = 0.97

export const PRIMARY_COLOR = "#0072e5" // blue
export const PRIMARY_LIGHT = lighten(PRIMARY_COLOR, LIGHT)
export const PRIMARY_LIGHTER = lighten(PRIMARY_COLOR, LIGHTER)
export const PRIMARY_LIGHTEST = lighten(PRIMARY_COLOR, LIGHTEST)

// https://mui.com/customization/default-theme/
const defaultTheme = createTheme()

const customTheme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
    },
    secondary: {
      main: "#7ab6a8",
    },
    background: {
      default: PRIMARY_LIGHTEST,
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
    materialyou: {
      primary: {
        light: PRIMARY_LIGHT,
        lighter: PRIMARY_LIGHTER,
        lightest: PRIMARY_LIGHTEST,
      },
    },

    tonalOffset: 0.4,
  },

  components: {
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: PRIMARY_LIGHTEST,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          color: defaultTheme.palette.text.primary,
          backgroundColor: PRIMARY_LIGHTEST,
        },
      },
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
      client_id: process.env.NEXT_PUBLIC_GOOGLE_ID,
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
        <ThemeProvider theme={customTheme}>
          <Context.Provider value={context}>
            <Head>
              <meta name="viewport" content="initial-scale=1, width=device-width" />
              <meta name="user" content={user?.id} />
            </Head>
            <Box sx={{ backgroundColor: "background.paper" }}>
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
