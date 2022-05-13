//
// lorem.tsx - test page showing typography and other components
//

import * as React from "react"
//import SplitPane, { Pane } from "react-split-pane"

import SplitPane, { Pane } from 'react-split-pane';

import Box from "@mui/material/Box"
import { useTheme } from "@mui/material/styles"
import { Typography } from "@mui/material"

import { Context } from "../components/context"
import { FullpageLayout } from "../components/layouts"
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

/*      <SplitPane split="vertical">
        <Pane initialSize="200px">You can use a Pane component</Pane>
        <div>or you can use a plain old div</div>
        <Pane initialSize="25%" minSize="10%" maxSize="500px">
          Using a Pane allows you to specify any constraints directly
        </Pane>
      </SplitPane>
*/


  return (
    <FullpageLayout title="Lorem Ipsum" description="Consectetur adipiscing elit">
      This is the content
    </FullpageLayout>
  )
}
