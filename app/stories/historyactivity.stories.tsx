//
// HistoryActivity.stories.tsx
//

import React, { useState } from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import Box from "@mui/material/Box"
import { ActivityBarWrapper } from "./helpers/storybook"
import { HistoryActivity } from "../components/activities/historyactivity"
import { fake_user_mickey, fake_history } from "./helpers/fakedata"
import { StorybookDecorator } from "./helpers/storybook"
import { Panel } from "../components/navigation/panel"

export default {
  title: "Activities/HistoryActivity",
  component: HistoryActivity,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    activityId: "act_history",
    user: fake_user_mickey,
    queries: fake_history,
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof HistoryActivity>

const Template: ComponentStory<typeof HistoryActivity> = (args) => {
  const [history, setHistory] = useState(args.queries)
  function handleCommand(event, command) {
    switch (command.command) {
      case "deleteHistory":
        const queries = command.args.queries
        setHistory(history.filter((query) => !queries.find((q) => q === query)))
        return
    }
    if (args.onCommand) {
      args.onCommand(event, command)
    }
  }

  const activities = [
    <Panel id="act_database" title="Database" icon="database">
      <Box sx={{ padding: 1 }}>Database activity</Box>
    </Panel>,
    <Panel id="act_bookmarks" title="Bookmarks" icon="bookmark">
      <Box sx={{ padding: 1 }}>Bookmarks activity</Box>
    </Panel>,
    <HistoryActivity id="act_history" title="History" icon="history" queries={history} onCommand={handleCommand} />,
  ]
  return <ActivityBarWrapper {...args} activities={activities} onCommand={args.onCommand} />
}

export const Primary = Template.bind({})

export const WithTodayOnly = Template.bind({})
WithTodayOnly.args = {
  queries: fake_history.slice(0, 8),
}

export const WithEmpty = Template.bind({})
WithEmpty.args = {
  queries: undefined,
}
