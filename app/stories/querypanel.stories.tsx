//
// querypanel.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { Box } from "@mui/material"
import { StorybookDecorator } from "./helpers/storybook"
import { QueryPanel } from "../components/panels/querypanel"
import { fake_connections1, fake_query1 } from "./helpers/fakedata"
import { getTestConnection } from "./helpers/fakedata"

export default {
  title: "Tabs/QueryPanel",
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

// load database and schema asynchronously
const chinookLoaders = [async () => await getTestConnection("Chinook.db")]
const northwindLoaders = [async () => await getTestConnection("Northwind.db")]

const LoadedTemplate: ComponentStory<typeof QueryPanel> = (args, { loaded: { connection } }) => {
  console.debug(`ChinookTemplate - connection: ${connection}`, connection)
  return (
    <Box sx={{ height: 800, width: 1 }}>
      <QueryPanel {...args} connections={[connection]} title={args.query.title} />
    </Box>
  )
}
export const WithChinook = LoadedTemplate.bind({})
WithChinook.loaders = chinookLoaders
WithChinook.args = {
  query: {
    connectionId: "dbc_chinook",
    sql: "SELECT * FROM albums",
    title: "All hits",
    createdAt: Date.parse("2022-06-21"),
  },
}

const NorthwindTemplate: ComponentStory<typeof QueryPanel> = (args, { loaded: { connection } }) => {
  console.debug(`NorthwindTemplate - connection: ${connection}`, connection)
  return (
    <Box sx={{ height: 1200, width: 1 }}>
      <QueryPanel {...args} connections={[connection]} title={args.query.title} />
    </Box>
  )
}
export const WithNorthwind = NorthwindTemplate.bind({})
WithNorthwind.loaders = northwindLoaders
WithNorthwind.args = {
  query: {
    connectionId: "dbc_northwind",
    sql: 'SELECT * FROM Orders WHERE ShipCountry = "USA"',
    title: "All domestic orders",
    createdAt: Date.parse("2025-04-17"),
  },
}
