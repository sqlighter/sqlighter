//
// layout.tsx - shared layout component
//

import Head from "next/head"
import Container from "@mui/material/Container"

import { Header } from "./header"
import { Footer } from "./footer"

export const TITLE = "Biomakers"

interface LayoutProps {
  title?: string
  subtitle?: string

  children: React.ReactNode
  home?: boolean

  /** True if back icon should be shown */
  back?: boolean

  /** True if search icon should be shown */
  search?: boolean
}

export default function Layout({ children, title, subtitle, home, back, search }: LayoutProps) {
  const pageTitle = title ? `${title} | ${TITLE}` : TITLE
  title = title || TITLE

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Biomarkers" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            title
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header title={title} subtitle={subtitle} back={back} search={search} />
      <Container maxWidth="sm">{children}</Container>
      <Footer />
    </>
  )
}
