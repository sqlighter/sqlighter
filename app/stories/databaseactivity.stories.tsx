//
// DatabaseActivity.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import Box from "@mui/material/Box"
import { ActivityBarWrapper } from "./wrappers"
import { DatabaseActivity } from "../components/database/databaseactivity"
import { fake_user_mickey, getTestConnection } from "../lib/test/fake_data"
import { StorybookDecorator } from "../components/storybook"
import { Panel } from "../components/navigation/panel"

export default {
  title: "Activities/DatabaseActivity",
  component: DatabaseActivity,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    activityId: "act_database",
    user: fake_user_mickey
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof DatabaseActivity>

// load database and schema asynchronously, component will then load the actual data
const chinookLoaders = [async () => await getTestConnection("Chinook.db")]
const northwindLoaders = [async () => await getTestConnection("Northwind.db")]
const sakilaLoaders = [async () => await getTestConnection("Sakila.db")]

const Template: ComponentStory<typeof DatabaseActivity> = (args, { loaded: { connection } }) => {
  const activities = [
    <DatabaseActivity
      id="act_database"
      title="Database"
      icon="database"
      connection={connection}
      connections={[connection]}
    />,
    <Panel id="act_bookmarks" title="Bookmarks" icon="bookmark">
      <Box sx={{ padding: 1 }}>Bookmarks activity</Box>
    </Panel>,
    <Panel id="act_history" title="History" icon="history">
      <Box sx={{ padding: 1 }}>History activity</Box>
    </Panel>,
  ]
  return <ActivityBarWrapper {...args} activities={activities} onCommand={args.onCommand} />
}

export const Primary = Template.bind({})
Primary.loaders = chinookLoaders

export const WithNorthwind = Template.bind({})
WithNorthwind.loaders = northwindLoaders

export const WithSakila = Template.bind({})
WithSakila.loaders = sakilaLoaders
