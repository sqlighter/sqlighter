//
// layouts.tsx - shared layout components for app and website pages
//

import Head from "next/head"
import Container from "@mui/material/Container"

export const TITLE = "SQLighter"

interface LayoutProps {
  /** Page title */
  title?: string

  /** Brief description shown in page's header */
  description?: string

  /** Layout contents */
  children: React.ReactNode

  /** True if back icon should be shown */
  showBack?: boolean

  /** Additional actions to be placed on the right hand side of the toolbar */
  actions?: any
}

/** A shared layout for website pages */
export function SiteLayout({ children, title }: LayoutProps) {
  const pageTitle = title ? `${title} | ${TITLE}` : TITLE
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content="sqlighter" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            title
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Container maxWidth="sm">{children}</Container>
    </>
  )
}
