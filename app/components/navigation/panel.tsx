//
// panel.tsx - basic box with metadata, eg: title, icon, etc
//

// TODO support drag and drop inside panel with callback

import Box from "@mui/material/Box"
import { Theme } from "@mui/material/styles"
import { SxProps } from "@mui/material"

export interface PanelProps {
  /** Id used for tabs, selections, paths, etc (optional) */
  id?: string

  /** Panel title (optional) */
  title?: string

  /** Panel's description (optional) */
  description?: string

  /** Icon that can be used to represent this panel for tabs, navigation, menus (optional) */
  icon?: React.ReactNode | string

  /** Layout contents */
  children?: React.ReactNode

  /** Style to be passed to component */
  sx?: SxProps<Theme>
}

/** A simple panel (used mostly to pass props to tabs or other layout componentsawer, header, footer, basic actions */
export function Panel({ sx, children }: PanelProps) {
  return <>{children}</>
}
