//
// signin.tsx - components and functions used to facilitate google signin
//

import * as React from "react"
import Box from "@mui/material/Box"
import { Context } from "./context"
import { IconButton, IconButtonProps } from "./ui/iconbutton"

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

//
// SigninIconButton - icon button that will raise a "signin" command
//

/** An IconButton that will raise a "signin" command when clicked */
export function SigninIconButton(props: Omit<IconButtonProps, "command">) {
  const signinCommand = {
    command: "signin",
    title: "Sign in",
    icon: "signin",
    args: {
      label: true,
      color: "primary",
    },
  }
  return <IconButton {...props} command={signinCommand} />
}

//
// GoogleSigninButton - 
//

export interface GoogleSigninButtonProps {
  /**
   * The button type, default is standard
   * @see https://developers.google.com/identity/gsi/web/reference/html-reference#size
   */
  type?: "standard" | "icon"

  /**
   * Button shape, default is "rectangular"
   * @see https://developers.google.com/identity/gsi/web/reference/html-reference#data-shape
   */
  shape?: "rectangular" | "pill" | "circle" | "square"

  /**
   * Button size, default is large
   * @see https://developers.google.com/identity/gsi/web/reference/html-reference#data-size
   */
  size?: "small" | "medium" | "large"
}

export function GoogleSigninButton(props: GoogleSigninButtonProps) {
  const context = React.useContext(Context)

  React.useEffect(() => {
    const gsi = context.googleSigninClient
    console.log(`GoogleSigninButton.useEffect - googleSigninClient: ${gsi}`, gsi)
    if (gsi) {
      // https://developers.google.com/identity/gsi/web/reference/js-reference#google.accounts.id.renderButton
      gsi.renderButton(document.getElementById("google_signin_button"), {
        theme: "outline",
        type: props.type,
        size: props.size,
        shape: props.shape,
        // width: 230,
      })
    }
  }, [context.googleSigninClient])

  return (
    <Box className="GoogleSigninButton-root">
      <div id="google_signin_button"></div>
    </Box>
  )
}
