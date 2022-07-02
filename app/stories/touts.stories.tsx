//
// oneage/touts.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator } from "./helpers/storybook"
import { Touts } from "../components/onepage/touts"
import { Area } from "../components/onepage/area"

export default {
  title: "OnePage/Touts",
  component: Touts,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    features: [
      {
        title: "Works with other tools",
        description:
          "Gmail works great with desktop clients like Microsoft Outlook, Apple Mail and Mozilla Thunderbird, including contact and event sync.",
        icon: "check",
      },
      {
        title: "Stay productive, even offline",
        description:
          "Gmail offline lets you read, reply, delete, and search your Gmail messages when you’re not connected to the internet.",
        icon: "wifioff",
      },
      {
        title: "Experience Gmail on any device",
        description: "Enjoy the ease and simplicity of Gmail, wherever you are.",
        icon: "devices",
      },
],
  },
} as ComponentMeta<typeof Touts>

const Template: ComponentStory<typeof Touts> = (args) => (
  <Area background="gray">
    <Touts {...args} />
  </Area>
)

export const Primary = Template.bind({})
