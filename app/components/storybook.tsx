//
// storybook.tsx - a decorator used to provide basic themed context to components in storybook
//

import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

// allotment styles + global overrides
import "allotment/dist/style.css"
import "../styles/global.css"

import { customTheme } from "./theme"

import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import Box from "@mui/material/Box"

export function StorybookDecorator(props) {
  return (
    <CssBaseline>
      <ThemeProvider theme={customTheme()}>
        <DndProvider backend={HTML5Backend}>
          <Box className="StorybookDecorator-root">{props.children}</Box>
        </DndProvider>
      </ThemeProvider>
    </CssBaseline>
  )
}
