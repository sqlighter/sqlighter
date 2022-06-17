//
// querypanel.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { Box } from "@mui/material"
import { StorybookDecorator } from "../components/storybook"
import { QueryPanel } from "../components/panels/querypanel"
import { fake_connections1, fake_query1, getChinookConnection } from "./fakedata"

export default {
  title: "Database/QueryPanel",
  component: QueryPanel,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    connections: fake_connections1,
    query: fake_query1,
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof QueryPanel>

const Template: ComponentStory<typeof QueryPanel> = (args) => {
  return (
    <Box sx={{ height: 800, width: 1 }}>
      <QueryPanel {...args} title={args.query.title} />
    </Box>
  )
}

export const Primary = Template.bind({})

/* TODO figure out why this story doesn't run in github action
const ChinookTemplate: ComponentStory<typeof QueryPanel> = (args, { loaded: { connections } }) => {
  return (
    <Box sx={{ height: 800, width: 1 }}>
      <QueryPanel {...args} connections={connections} title={args.query.title} />
    </Box>
  )
}
export const WithChinook = ChinookTemplate.bind({})
WithChinook.args = {
  query: {
    connectionId: "dbc_chinook",
    sql: "select * from albums",
    title: "All chinook hits",
    createdAt: new Date(),
  },
}
WithChinook.loaders = [
  async () => ({
    connections: [await getChinookConnection()],
  }),
]
*/
