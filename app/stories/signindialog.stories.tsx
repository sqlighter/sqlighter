//
// signindialog.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator } from "./helpers/storybook"
import { SigninDialog } from "../components/navigation/signindialog"

export default {
  title: "Navigation/SigninDialog",
  component: SigninDialog,
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
} as ComponentMeta<typeof SigninDialog>

const Template: ComponentStory<typeof SigninDialog> = (args) => <SigninDialog />
export const Primary = Template.bind({})
