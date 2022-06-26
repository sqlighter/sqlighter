//
// tag.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator } from "./helpers/storybook"
import { Tag } from "../components/ui/tags"

export default {
  title: "UI/Tag",
  component: Tag,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
} as ComponentMeta<typeof Tag>

const Template: ComponentStory<typeof Tag> = (args) => <Tag {...args} />

export const Primary = Template.bind({})
Primary.args = {
  title: "Glucose",
  onClick: null,
  href: null,
}

export const WithHref = Template.bind({})
WithHref.args = {
  title: "Wikipedia",
  href: "https://www.wikipedia.org",
}

export const WithoutHref = Template.bind({})
WithoutHref.args = {
  title: "No clicking",
  href: null,
  onCommand: null,
}

export const WithSuccessDot = Template.bind({})
WithSuccessDot.args = {
  title: "Glucose",
  href: "/glucose",
  dot: "success",
}

export const WithWarningDot = Template.bind({})
WithWarningDot.args = {
  title: "Glucose",
  href: "/glucose",
  dot: "warning",
}

export const WithErrorDot = Template.bind({})
WithErrorDot.args = {
  title: "Glucose",
  href: "/glucose",
  dot: "error",
}
