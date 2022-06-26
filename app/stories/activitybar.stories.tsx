//
// ActivityBar.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import Box from "@mui/material/Box"

import { ActivityBarWrapper, StorybookDecorator } from "./helpers/storybook"
import { fake_user_mickey } from "./helpers/fakedata"

import { TablePanel } from "../components/panels/tablepanel"
import { ActivityBar } from "../components/navigation/activitybar"
import { Panel } from "../components/navigation/panel"

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
      <Box sx={{ padding: 1 }}>Database activity</Box>
    </Panel>,
    <Panel id="act_bookmarks" title="Bookmarks" icon="bookmark">
      <Box sx={{ padding: 1 }}>Bookmarks activity</Box>
    </Panel>,
    <Panel id="act_history" title="History" icon="history">
      <Box sx={{ padding: 1 }}>History activity</Box>
    </Panel>,
  ]
  return <ActivityBarWrapper {...args} activities={activities} onCommand={args.onCommand} />
}
export const Primary = ActivityBarTemplate.bind({})

export const WithUser = ActivityBarTemplate.bind({})
WithUser.args = {
  user: fake_user_mickey,
}
