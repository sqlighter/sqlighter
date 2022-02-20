import { GetStaticProps } from "next"
import Head from "next/head"
import Link from "next/link"

import * as React from "react"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"

import { useUser } from "../lib/auth/hooks"
import { Context } from "../components/context"
import Layout from "../components/layout"
import { Typography } from "@mui/material"

import { SigninPanel } from "../components/signin"
import { Section } from "../components/section"

export default function LoremPage(props) {
  const context = React.useContext(Context)

  return (
    <Layout title="Lorem Ipsum" subtitle="Consectetur adipiscing elit">
      <Section large title="This is a section" subtitle="This is the sections's subtitle">
        <Typography variant="body1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In neque ex, feugiat ut posuere eget, interdum ut
          est. Nam vitae dui aliquet, elementum augue nec, fringilla arcu. Suspendisse ut fringilla sem. Sed aliquam
          pretium commodo. Proin pharetra varius odio in condimentum. Mauris et nisi malesuada, commodo augue eget,
          rhoncus magna.
        </Typography>
      </Section>
      {["First", "Second", "Third", "Fourth", "Fifth"].map((section) => {
        return (
          <Section key={section} title={section + " subsection"} subtitle="Also has a subtitle">
            <Typography variant="body1">
              Vivamus consequat neque tellus, vitae pretium lacus interdum et. Vestibulum ante ipsum primis in faucibus
              orci luctus et ultrices posuere cubilia curae; Praesent sollicitudin tincidunt ullamcorper. Sed eu eros
              placerat, faucibus nisi et, pharetra nisl. Sed et est vehicula, semper nunc sit amet, feugiat dolor.
            </Typography>
            <Typography variant="body1">
              Vestibulum rhoncus, felis quis scelerisque convallis, urna urna lobortis velit, id viverra leo turpis in
              leo. Donec sit amet tellus odio. Praesent mattis tincidunt magna sit amet viverra. Maecenas imperdiet mi
              et nisi bibendum finibus. Aenean sit amet nunc eleifend eros euismod vehicula sollicitudin non ante.
            </Typography>
          </Section>
        )
      })}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      //
    },
  }
}
