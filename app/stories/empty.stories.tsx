//
// empty.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator } from "./helpers/storybook"
import { Empty, MissingFeature } from "../components/ui/empty"

export default {
  title: "UI/Empty",
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
  variant: "fancy",
  title: "Is this art?",
  description: "Drawing rectangles is where it's at",
}

const MissingFeatureTemplate: ComponentStory<typeof Empty> = (args) => <MissingFeature {...args} />
export const WithMissingFeature = MissingFeatureTemplate.bind([])
