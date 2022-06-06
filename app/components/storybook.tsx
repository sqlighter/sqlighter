import Head from "next/head"
import Script from "next/script"
import { useRouter } from "next/router"

// allotment styles + global overrides
import "allotment/dist/style.css"
import "../styles/global.css"

import { customTheme, PRIMARY_LIGHTEST, customSx } from "./theme"

import CssBaseline from "@mui/material/CssBaseline"
import GlobalStyles from "@mui/material/GlobalStyles"
import { ThemeProvider } from "@mui/material/styles"
import Box from "@mui/material/Box"

export function StorybookDecorator(props) {
  return (
    <CssBaseline>
      <GlobalStyles styles={{ body: { backgroundColor: PRIMARY_LIGHTEST } }} />
      <ThemeProvider theme={customTheme()}>
        <Box className="StorybookDecorator-root" sx={customSx}>{props.children}</Box>
      </ThemeProvider>
    </CssBaseline>
  )
}
