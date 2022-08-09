//
// onepagelayout.tsx - layout for onepage marketing site and utility pages like terms, privacy, etc.
//

import Head from "next/head"
import Image from "next/image"
import { SxProps, Theme, alpha } from "@mui/material"
import Container from "@mui/material/Container"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"

import { Footer } from "./footer"
import logo from "../../public/branding/logo.png"

export const TITLE = "SQLighter"
export const HEADER_HEIGHT = 64

const OnePageLayout_SxProps: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  minHeight: 1,

  backgroundColor: "background.paper",

  ".OnePageLayout-appBar": {
    height: HEADER_HEIGHT,
    backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
    backdropFilter: "blur(8px)",
  },

  ".OnePageLayout-header": {
    height: HEADER_HEIGHT,
    display: "flex",
    alignItems: "center",
  },

  ".OnePageLayout-contents": {
    flexGrow: 1,

    display: "flex",
    flexDirection: "column",
    minHeight: 1,

    paddingTop: `${HEADER_HEIGHT}px`,
    backgroundColor: "background.paper",
  },
}

interface OnePageLayoutProps {
  /** Page title */
  title?: string

  /** Brief description shown in page's header */
  description?: string

  /** True if back icon should be shown */
  showBack?: boolean

  /** Additional actions to be placed on the right hand side of the toolbar */
  actions?: any

  /** Maximum page width, defaults to 'lg' */
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl"

  /** Layout contents */
  children?: any
}

/** A shared one page layout for website pages with fixed header and added footer */
export function OnePageLayout(props: OnePageLayoutProps) {
  const title = props.title ? `${props.title} | ${TITLE}` : TITLE
  const description = props.description || TITLE
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta name="description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Box className="OnePageLayout-root" sx={OnePageLayout_SxProps}>
        <AppBar className="OnePageLayout-appBar" position="fixed" color="transparent" elevation={0}>
          <Container
            className="OnePageLayout-header"
            maxWidth={props.maxWidth || "lg"}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box sx={{ height: 28, width: 120, minWidth: 120 }}>
              <Image src={logo} alt="SQLighter" objectFit="contain" objectPosition="left center" />
            </Box>
            <Box sx={{ flexGrow: 1 }}>&nbsp;</Box>
            {props.actions}
          </Container>
        </AppBar>
        <Box className="OnePageLayout-contents" component="main">
          {props.children}
          <Box sx={{ flexGrow: 1 }} />
          <Footer maxWidth={props.maxWidth} />
        </Box>
      </Box>
    </>
  )
}
