//
// queryrunpanel.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator } from "./helpers/storybook"
import { QueryStatus } from "../components/database/querystatus"
import { fake_connection1, fake_queryCompletedLarge, fake_queryRunning1, fake_queryError1 } from "./helpers/fakedata"

export default {
  title: "Database/QueryStatus",
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
    run: fake_queryCompletedLarge,
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
