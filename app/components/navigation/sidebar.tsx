//
// sidebar.tsx - panel shown by tabs layout with alternative activities
//

import React from "react"
import { Theme, SxProps } from "@mui/material/styles"
import Box from "@mui/material/Box"
import { PanelElement, PanelProps } from "./panel"

export const SIDEBAR_MIN_WIDTH = 200

// Styles applied to all components
export const Sidebar_SxProps: SxProps<Theme> = {
  width: 1,
  height: 1,

  display: "flex",
  flexDirection: "column",

  ".Sidebar-logo": {
    minHeight: 48,
    height: 48,
    backgroundColor: "background.paper",
    borderBottom: 1,
    borderBottomColor: "divider",
  },

  ".Sidebar-activities": {
    flexGrow: 1,
    overflow: "scroll",
  },

  ".Sidebar-activity": {
    width: 1,
    height: 1,
  },
}

interface SidebarProps extends PanelProps {
  /** Activity that is currently selected */
  activityId: string
  /** Activities shown as icons in activity bar and as panels in side bar */
  activities: PanelElement[]
  /** Sidebar is currently visible */
  visible?: boolean
}

/**
 * Sidebar shows the activity highlighted in the activity bar. The sidebar can be
 * opened or closed by clicking on the selected activity or by snapping closed the
 * allotment pane. The content of the activity is always shown for now to make it
 * easier to retain the state of the content, eg. data, scrolling position, etc.
 */
export function Sidebar(props: SidebarProps) {
  //
  // render
  //

  return (
    <Box className="Sidebar-root" sx={Sidebar_SxProps}>
      <Box className="Sidebar-logo"></Box>
      <Box className="Sidebar-activities">
        {props.activities.map((activity: PanelElement) => {
          const display = !props.visible || activity.props.id != props.activityId ? "none" : null
          return (
            <Box className="Sidebar-activity" key={activity.props.id} sx={{ display }}>
              {activity}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
