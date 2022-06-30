//
// userbutton.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator } from "./helpers/storybook"
import { fake_user_mickey, fake_user_longname } from "./helpers/fakedata"
import { TablePanel } from "../components/panels/tablepanel"
import { UserButton } from "../components/auth/userbutton"

export default {
  title: "Auth/UserButton",
  component: UserButton,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    user: undefined,
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof UserButton>

const Template: ComponentStory<typeof TablePanel> = (args) => <UserButton {...args} />
export const Primary = Template.bind({})

export const WithUser = Template.bind({})
WithUser.args = {
  user: fake_user_mickey,
}

export const WithLongName = Template.bind({})
WithLongName.args = {
  user: fake_user_longname,
}
