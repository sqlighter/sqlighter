//
// signinbutton.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator } from "./helpers/storybook"
import { SigninButton } from "../components/auth/signinbutton"

export default {
  title: "Auth/SigninButton",
  component: SigninButton,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    //
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof SigninButton>

const Template: ComponentStory<typeof SigninButton> = (args) => <SigninButton {...args} />
export const Primary = Template.bind({})
