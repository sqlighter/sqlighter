//
// sidebar.tsx - shows a panel from a collection
// https://code.visualstudio.com/docs/getstarted/userinterface
//

import Box from "@mui/material/Box"
import { Panel, PanelProps, PanelElement } from "./panel"

export const SIDEBAR_MIN_WIDTH = 180

export interface SideBarProps {
  /** Currently selected activity */
  activityId: string

  /** List of activities to be shown (one at a time) */
  activities: PanelElement[]
}

/** A sidebar showing one panel at a time from a choice of panels */
export function SideBar({ activities, activityId }: SideBarProps) {
  return (
    <>
      {activities.map((activity: PanelElement) => {
        const activityProps = activity.props
        return (
          <Box
            key={activityProps.id}
            sx={{ width: "100%", height: "100%", display: activityProps.id != activityId ? "none" : null }}
          >
            {activity}
          </Box>
        )
      })}
    </>
  )
}
