//
// onepagelayout.tsx - layout for onepage marketing site and utility pages like terms, privacy, etc.
//

import Head from "next/head"
import Link from "next/link"

import { SxProps, Theme, alpha } from "@mui/material"
import Container from "@mui/material/Container"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { Area } from "./area"

export const TITLE = "sqlighter"
export const HEADER_HEIGHT = 64

const OnePageLayout_SxProps: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",

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
        <link rel="icon" href="/favicon.png" />
        <meta property="og:image" content="/branding/banner.png" />
        <meta name="og:title" content={title} />
        <meta name="description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Box className="OnePageLayout-root" sx={OnePageLayout_SxProps}>
        <AppBar className="OnePageLayout-appBar" position="fixed" color="transparent" elevation={0}>
          <Container className="OnePageLayout-header" maxWidth="lg">
            <img src="/branding/logo.png" alt="sqlighter" height={28} />
          </Container>
        </AppBar>
        <Box className="OnePageLayout-contents" component="main">
          {props.children}
          <Area>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  sqlighter | made remotely 🌏
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Link href="/privacy">Privacy Policy</Link> |<Link href="/terms">Terms of Service</Link>
                </Typography>
              </Box>
              <Box>twitter | medium | somethingelse</Box>
            </Box>
          </Area>
        </Box>
      </Box>
    </>
  )
}
