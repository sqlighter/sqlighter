//
// googlesigninbutton.tsx - components and functions used to facilitate google signin
//

import * as React from "react"
import Box from "@mui/material/Box"
import { Context } from "../context"

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

/** Google one tap signin button */
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
