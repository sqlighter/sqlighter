
import Head from "next/head"
import Script from "next/script"
import { useRouter } from "next/router"
import "../styles/global.css"
import { customTheme, PRIMARY_LIGHTEST } from "../components/theme"

import { useState } from "react"
import CssBaseline from "@mui/material/CssBaseline"
import GlobalStyles from "@mui/material/GlobalStyles"
import { ThemeProvider } from "@mui/material/styles"

export function StorybookDecorator(props) {
  return (
    <CssBaseline>
      <GlobalStyles styles={{ body: { backgroundColor: PRIMARY_LIGHTEST } }} />
      <ThemeProvider theme={customTheme()}>pre{props.children}post</ThemeProvider>
    </CssBaseline>
  )
}
