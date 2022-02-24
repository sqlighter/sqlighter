//
// storybook.tsx - a storybook decorator used to apply the project's custom styles, etc
//

import React from "react"
import CssBaseline from "@mui/material/CssBaseline"
import GlobalStyles from "@mui/material/GlobalStyles"
import { ThemeProvider } from "@mui/material/styles"
import Container from "@mui/material/Container"

import { Context } from "../components/context"
import { customTheme, PRIMARY_LIGHTEST } from "../components/theme"

interface StorybookDecoratorProps {
  /** Used passed to "app" as logged in */
  user?: any

  /** Story to be shown inside this decorator */
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
        <ThemeProvider theme={customTheme()}>
          <Container maxWidth="sm">{children}</Container>
        </ThemeProvider>
      </Context.Provider>
    </CssBaseline>
  )
}
