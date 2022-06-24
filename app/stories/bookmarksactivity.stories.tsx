//
// BookmarksActivity.stories.tsx
//

import React, { useState } from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import Box from "@mui/material/Box"
import { ActivityBarWrapper } from "./test/wrappers"
import { BookmarksActivity } from "../components/activities/bookmarksactivity"
import { fake_user_mickey, fake_bookmarks } from "./test/fakedata"
import { StorybookDecorator } from "../components/storybook"
import { Panel } from "../components/navigation/panel"

export default {
  title: "Activities/BookmarksActivity",
  component: BookmarksActivity,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    activityId: "act_bookmarks",
    user: fake_user_mickey,
    queries: fake_bookmarks,
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof BookmarksActivity>

const Template: ComponentStory<typeof BookmarksActivity> = (args) => {
  const [history, setHistory] = useState(args.queries)
  function handleCommand(event, command) {
    switch (command.command) {
      case "deleteQuery":
        const query = command.args
        setHistory(history.filter((q) => q !== query))
        return
      case "deleteQueries":
        const queries = command.args
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
    <BookmarksActivity id="act_bookmarks" title="Bookmarks" icon="bookmark" queries={history} onCommand={handleCommand} />,
    <Panel id="act_historys" title="History" icon="history">
      <Box sx={{ padding: 1 }}>Bookmarks activity</Box>
    </Panel>,
  ]
  return <ActivityBarWrapper {...args} activities={activities} onCommand={args.onCommand} />
}

export const Primary = Template.bind({})

export const WithFewBoookmarks = Template.bind({})
WithFewBoookmarks.args = {
  queries: fake_bookmarks.slice(0, 8),
}

export const WithEmpty = Template.bind({})
WithEmpty.args = {
  queries: [] // show zero bookmarks list
}

export const WithEmptyAndNoUser = Template.bind({})
WithEmptyAndNoUser.args = {
  queries: undefined, // show, please signin to view bookmarks
  user: undefined,
}
