//
// lorem.tsx - test page showing typography and other components
//

import * as React from "react"
import Box from "@mui/material/Box"
import { useTheme } from "@mui/material/styles"
import { Typography } from "@mui/material"

import { Context } from "../components/context"
import { AppLayout } from "../components/layouts"
import { Section } from "../components/section"

export default function LoremPage(props) {
  const context = React.useContext(Context)
  const theme = useTheme()

  function variantSpecs(variant, sample) {
    return (
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant={variant} flexGrow={1} component="div">
          {sample}
        </Typography>
        <Typography variant="body2" textAlign="right" minWidth={100}>
          {theme.typography[variant].fontSize}
        </Typography>
      </Box>
    )
  }

  return (
    <AppLayout title="Lorem Ipsum" description="Consectetur adipiscing elit">
      <Box sx={{ width: "100%", maxWidth: 500 }}>
        {variantSpecs("h1", "h1. Heading")}
        {variantSpecs("h2", "h3. Heading")}
        {variantSpecs("h3", "h3. Heading")}
        {variantSpecs("h4", "h4. Heading")}
        {variantSpecs("h5", "h5. Heading")}
        {variantSpecs("h6", "h6. Heading")}

        {variantSpecs(
          "body1",
          "body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam."
        )}
        {variantSpecs(
          "subtitle1",
          "subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur"
        )}

        {variantSpecs(
          "body2",
          "body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam."
        )}
        {variantSpecs(
          "subtitle2",
          "subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur"
        )}

        {variantSpecs("button", "button text")}
        {variantSpecs("caption", "caption text")}
        {variantSpecs("overline", "overline text")}
      </Box>

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
    </AppLayout>
  )
}
