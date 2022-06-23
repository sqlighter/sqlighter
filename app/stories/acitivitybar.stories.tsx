//
// ActivityBar.stories.tsx
//

import React, { useState } from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { Allotment } from "allotment"
import Box from "@mui/material/Box"

import { fake_user_mickey } from "./fakedata"
import { StorybookDecorator } from "../components/storybook"
import { TablePanel } from "../components/panels/tablepanel"
import { ActivityBar, ACTIVITYBAR_WIDTH } from "../components/navigation/activitybar"
import { Panel } from "../components/navigation/panel"

function ActivityWrapper(props) {
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
          <Box sx={{ width: 1, height: 1, padding: 2 }}>{activityId}</Box>
        </Allotment.Pane>
        <Allotment.Pane>
          <Box sx={{ width: 1, height: 1, padding: 2, backgroundColor: "white" }}>Contents</Box>
        </Allotment.Pane>
      </Allotment>
    </Box>
  )
}

export default {
  title: "Activities/ActivityBar",
  component: ActivityBar,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    activityId: "act_database",
    user: undefined,
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof ActivityBar>

const ActivityBarTemplate: ComponentStory<typeof TablePanel> = (args) => {
  const activities = [
    <Panel id="act_database" title="Database" icon="database">
      Database
    </Panel>,
    <Panel id="act_bookmarks" title="Bookmarks" icon="bookmark">
      Bookmarks
    </Panel>,
    <Panel id="act_history" title="History" icon="history">
      History
    </Panel>,
  ]

  return <ActivityWrapper {...args} activities={activities} />
}
export const Primary = ActivityBarTemplate.bind({})

export const WithUser = ActivityBarTemplate.bind({})
WithUser.args = {
  user: fake_user_mickey,
}
