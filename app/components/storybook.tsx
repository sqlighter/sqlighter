//
// storybook.tsx - a storybook decorator used to apply the project's custom styles, etc
//

import React from "react"
import CssBaseline from "@mui/material/CssBaseline"
import GlobalStyles from "@mui/material/GlobalStyles"
import { customTheme, PRIMARY_LIGHTEST } from "../components/theme"
import { ThemeProvider } from "@mui/material/styles"
import { Context } from "../components/context"

interface StorybookDecoratorProps {
  user?: any

  children: any
}

/** A fake app context for Storybook stories to run in */
export function StorybookDecorator({ user, children }: StorybookDecoratorProps) {
  function signout(redirectUrl?: string): void {
    console.log(`signout() - redirectUrl: ${redirectUrl}`)
  }

  const context = {
    // undefined while user is loading or google signin script is loading
    user,
    // true once google signin has been initialized
    isGoogleSigninLoaded: true,
    // signout + redirect callback
    signout,
  }

  return (
    <CssBaseline>
      <GlobalStyles styles={{ body: { backgroundColor: PRIMARY_LIGHTEST } }} />
      <Context.Provider value={context}>
        <ThemeProvider theme={customTheme()}>{children}</ThemeProvider>
      </Context.Provider>
    </CssBaseline>
  )
}
