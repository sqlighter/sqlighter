//
// layout.tsx - shared layout component
//

import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

import Container from "@mui/material/Container"
import { styled, createTheme, ThemeProvider } from "@mui/system"
import Box from "@mui/material/Box"

import { Header } from "./header"
import Footer from "./footer"
import { Fragment } from "react"

interface LayoutProps {
  title?: string
  subtitle?: string

  children: React.ReactNode
  home?: boolean
  back?: boolean | string
}

export default function Layout({ children, title, subtitle, home, back }: LayoutProps) {
  //  title = title || "Biomarkers"

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Learn how to build a personal website using Next.js" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            title
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header title={title} subtitle={subtitle} back={back} />
      <Container maxWidth="sm">{children}</Container>
      <Footer />
    </>
  )
}
