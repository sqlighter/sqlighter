//
// signin.tsx - components and functions used to facilitate google signin
//

import { useRouter } from "next/router"

import * as React from "react"
import Box from "@mui/material/Box"

import { Context } from "./context"
import { Empty } from "./ui/empty"
import signinImage from "../public/images/empty3.jpg"

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

export function getDisplayName(user) {
  return user?.passport?.displayName || ""
}

/** Returns user's email (if available) */
export function getEmail(user) {
  return user?.passport?.emails?.[0]?.value
}

export function getProfileImageUrl(user) {
  return user?.passport?.photos?.[0]?.value
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
        width: 230,
      })
    }
  }, [context.isGoogleSigninLoaded])
  return (
    <Box width={230}>
      <div id="google_signin_button"></div>
    </Box>
  )
}

export function SigninPanel() {
  const context = React.useContext(Context)

  React.useEffect(() => {
    if (context.isGoogleSigninLoaded) {
      promptSignin()
    }
  }, [context.isGoogleSigninLoaded])

  return (
    <Empty title="Welcome" description="Sign in securely to access your data" image={signinImage}>
      <SigninButton />
    </Empty>
  )
}
