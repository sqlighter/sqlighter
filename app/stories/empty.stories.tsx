//
// empty.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator } from "../components/storybook"
import { Empty } from "../components/ui/empty"

export default {
  title: "Components/Empty",
  component: Empty,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    image: null,
    icon: "file",
    title: "No files found",
    description: "Maybe go back and try a different keyword?",
  },
} as ComponentMeta<typeof Empty>

const Template: ComponentStory<typeof Empty> = (args) => <Empty {...args} />

export const Primary = Template.bind({})

export const WithImage = Template.bind({})
WithImage.args = {
  image: "/images/empty2.jpg",
  icon: undefined,
}
