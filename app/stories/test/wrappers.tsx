//
// Wrappers.tsx - single use components used to give context to components tested in stories
//

import React, { useState } from "react"
import { Allotment } from "allotment"
import Box from "@mui/material/Box"
import { ActivityBar, ACTIVITYBAR_WIDTH } from "../../components/navigation/activitybar"

//
// ActivityWrapper
//

export function ActivityBarWrapper(props) {
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [activityId, setActivityId] = useState(props.activityId || props.activities[0].props.id)
  function handleCommand(event, command) {
    switch (command.command) {
      case "changedActivity":
        if (activityId == command.args.id) {
          setSidebarVisible(!sidebarVisible)
        } else {
          setActivityId(command.args.id)
        }
        return
    }
    if (props.onCommand) {
      props.onCommand(event, command)
    }
  }

  return (
    <Box sx={{ height: 600, width: 800, border: 1, backgroundColor: (theme: any) => theme.palette.background.default }}>
      <Allotment onVisibleChange={() => setSidebarVisible(!sidebarVisible)}>
        <Allotment.Pane maxSize={ACTIVITYBAR_WIDTH} minSize={ACTIVITYBAR_WIDTH} visible>
          <ActivityBar
            activityId={activityId}
            activities={props.activities}
            user={props.user}
            onCommand={handleCommand}
          />
        </Allotment.Pane>
        <Allotment.Pane minSize={200} preferredSize={200} visible={sidebarVisible} snap>
          <Box sx={{ width: 1, height: 1, flexGrow: 1, overflow: "scroll" }}>
            {props.activities?.map((activity) => {
              return (
                <Box key={activity.props.id} sx={{ display: activity.props.id == activityId ? "block" : "none" }}>
                  {activity}
                </Box>
              )
            })}
          </Box>
        </Allotment.Pane>
        <Allotment.Pane>
          <Box sx={{ width: 1, height: 1, padding: 1, backgroundColor: "white" }}>Contents</Box>
        </Allotment.Pane>
      </Allotment>
    </Box>
  )
}
