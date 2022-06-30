//
// signinbutton.tsx - simple signin button
//

import * as React from "react"
import { IconButton, IconButtonProps } from "../ui/iconbutton"

/** An IconButton that will raise a "signin" command when clicked */
export function SigninButton(props: Omit<IconButtonProps, "command">) {
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
