//
//
//

import * as React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { createTheme } from "@mui/material/styles"

import Layout from "../../components/layout"

export default function TypePage() {
  const theme = createTheme()

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
    <Layout title="Typography">
      <Box sx={{ width: "100%", maxWidth: 500 }}>
        {variantSpecs("h1", "h1. Heading")}
        {variantSpecs("h2", "h3. Heading")}
        {variantSpecs("h3", "h3. Heading")}
        {variantSpecs("h4", "h4. Heading")}
        {variantSpecs("h5", "h5. Heading")}
        {variantSpecs("h6", "h6. Heading")}

        {variantSpecs(
          "subtitle1",
          "subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur"
        )}
        {variantSpecs(
          "subtitle2",
          "subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur"
        )}
        {variantSpecs(
          "body1",
          "body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam."
        )}
        {variantSpecs(
          "body2",
          "body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam."
        )}

        {variantSpecs("button", "button text")}
        {variantSpecs("caption", "caption text")}
        {variantSpecs("overline", "overline text")}
      </Box>
    </Layout>
  )
}
