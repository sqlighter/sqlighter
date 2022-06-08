//
// queryrunpanel.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { Box } from "@mui/material"
import { StorybookDecorator } from "../components/storybook"
import { QueryPanel } from "../components/database/querypanel"
import { fake_connections1, fake_connection1, fake_query1 } from "./fakedata"

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

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof QueryPanel> = (args) => {
  return (
    <Box sx={{ height: 800, width: 1 }}>
      <QueryPanel {...args} title={args.query.title} />
    </Box>
  )
}

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Primary = Template.bind({})
