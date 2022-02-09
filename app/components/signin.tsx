//
// signin.tsx - components and functions used to facilitate google signin
//

import * as React from "react"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { Context } from "./context"

export function getGoogleSigninClient() {
  return (window as any)?.google?.accounts?.id
}

export function promptSignin() {
  const gsi = getGoogleSigninClient()
  if (gsi) {
    gsi.prompt((notification) => {
      console.debug("promptSignin", notification)
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // https://developers.google.com/identity/gsi/web/reference/js-reference#PromptMomentNotification
        // continue with another identity provider.
      }
    })
  } else {
    console.debug("promptSignin was called but Google Signin is not initialized yet")
  }
}

export function SigninButton() {
  const context = React.useContext(Context)

  React.useEffect(() => {
    const gsi = getGoogleSigninClient()
    // console.log("SigninButton.useEffect - googleAccountsId: " + context.googleAccountsId)
    if (gsi) {
      // https://developers.google.com/identity/gsi/web/reference/js-reference#google.accounts.id.renderButton
      gsi.renderButton(document.getElementById("google_signin_button"), {
        theme: "outline",
        size: "large",
        shape: "pill",
      })
    }
  }, [context.googleSigninLoaded])
  return (
    <Box maxWidth={400}>
      <div id="google_signin_button" style={{ width: 400 }}></div>
    </Box>
  )
}

export function SigninPanel() {
  const context = React.useContext(Context)

  React.useEffect(() => {
    if (context.googleSigninLoaded) {
      promptSignin()
    }
  }, [context.googleSigninLoaded])

  return (
    <Stack>
      <Typography variant="h4">Welcome to Biomarkers</Typography>
      <Typography variant="body2">Please sign in using Google</Typography>
      <SigninButton />
    </Stack>
  )
}
