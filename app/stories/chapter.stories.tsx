//
// oneage/chapter.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator } from "./helpers/storybook"
import { Chapter } from "../components/onepage/chapter"

export default {
  title: "OnePage/Chapter",
  component: Chapter,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    icon: "/test/gmail.svg",
    title: <>Show the world<br/>how it’s done.</>,
    description: "Get started with a more powerful Gmail.",
    image: "/test/centered.webp",
    variant: "centered"
  },
} as ComponentMeta<typeof Chapter>

const Template: ComponentStory<typeof Chapter> = (args) => <Chapter {...args} />

export const Centered = Template.bind({})
