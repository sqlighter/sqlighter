//
// queryrunpanel.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { Box } from "@mui/material"
import { StorybookDecorator } from "../components/storybook"
import { QueryStatus } from "../components/database/querystatus"
import { fake_connection1, fake_queryCompleted1, fake_queryRunning1, fake_queryError1 } from "./fakedata"

export default {
  title: "Components/QueryStatus",
  component: QueryStatus,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    connection: fake_connection1,
    run: fake_queryCompleted1,
  },
} as ComponentMeta<typeof QueryStatus>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof QueryStatus> = (args) => <QueryStatus {...args} />

export const Completed = Template.bind({})

export const Running = Template.bind({})
Running.args = {
  run: fake_queryRunning1,
}

export const Error = Template.bind({})
Error.args = {
  run: fake_queryError1,
}
