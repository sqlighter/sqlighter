//
// signin.tsx - components and functions used to facilitate google signin
//

import * as React from "react"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { Context } from "./context"

export function SigninButton() {
  const context = React.useContext(Context)

  React.useEffect(() => {
    // console.log("SigninButton.useEffect - googleAccountsId: " + context.googleAccountsId)
    if (context.googleAccountsId) {
      // https://developers.google.com/identity/gsi/web/reference/js-reference#google.accounts.id.renderButton
      context.googleAccountsId.renderButton(document.getElementById("google_signin_button"), {
        theme: "outline",
        size: "large",
        shape: "pill",
      })
    }
  }, [context.googleAccountsId])
  return (
    <Box maxWidth={400}>
      <div id="google_signin_button" style={{ width: 400 }}></div>
    </Box>
  )
}

export function SigninPanel() {
  const context = React.useContext(Context)

  React.useEffect(() => {
    // console.log("SigninButton.useEffect - googleAccountsId: " + context.googleAccountsId)
    if (context.googleAccountsId) {
      context.googleAccountsId.prompt((notification) => {
        console.log(`SigninPanel.prompt`, notification)
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // https://developers.google.com/identity/gsi/web/reference/js-reference#PromptMomentNotification
          // continue with another identity provider.
        }
      })
    }
  }, [context.googleAccountsId])

  return (
    <Stack>
      <Typography variant="h4">Welcome to Biomarkers</Typography>
      <Typography variant="body2">Please sign in using Google</Typography>
      <SigninButton />
    </Stack>
  )
}
