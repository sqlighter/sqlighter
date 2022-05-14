//
// sidebar.tsx - shows a panel from a collection
// https://code.visualstudio.com/docs/getstarted/userinterface
//

import Box from "@mui/material/Box"
import { Panel, PanelProps } from "./panel"

export const SIDEBAR_MIN_WIDTH = 160

export interface SideBarProps {
  /** List of activities to be shown (one at a time) */
  activities: PanelProps[]

  /** Currently selected activity */
  activityId: string
}

/** A sidebar showing one panel at a time from a choice of panels */
export function SideBar({ activities, activityId }: SideBarProps) {
  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
      {activities.map((activity: PanelProps) => (
        <Box
          key={activity.id}
          sx={{ width: "100%", height: "100%", display: activity.id != activityId ? "none" : null }}
        >
          <Panel {...activity} />
        </Box>
      ))}
    </Box>
  )
}
