//
// queryrunpanel.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { Box } from "@mui/material"
import { StorybookDecorator } from "./helpers/storybook"
import { QueryRunPanel } from "../components/database/queryrunpanel"
import {
  fake_connection1,
  fake_queryCompletedSmall,
  fake_queryCompletedLarge,
  fake_queryRunning1,
  fake_queryError1,
} from "./helpers/fakedata"

export default {
  title: "Database/QueryRunPanel",
  component: QueryRunPanel,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    connection: fake_connection1,
    run: fake_queryCompletedLarge,
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof QueryRunPanel>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof QueryRunPanel> = (args) => (
  <Box sx={{ height: 500 }}>
    <QueryRunPanel {...args} />
  </Box>
)

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Completed = Template.bind({})

export const CompletedSmall = Template.bind({})
CompletedSmall.args = {
  run: fake_queryCompletedSmall,
}

export const Running = Template.bind({})
Running.args = {
  run: fake_queryRunning1,
}

export const Error = Template.bind({})
Error.args = {
  run: fake_queryError1,
}
