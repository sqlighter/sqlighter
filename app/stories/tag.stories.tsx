import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { Tag } from "../components/tags"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Tag",
  component: Tag,
} as ComponentMeta<typeof Tag>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Tag> = (args) => <Tag {...args} />

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Primary = Template.bind({})
Primary.args = {
  label: "Glucose",
  onClick: null,
  href: null,
}

export const WithHref = Template.bind({})
WithHref.args = {
  label: "Glucose",
  href: "/glucose",
}

export const WithoutHref = Template.bind({})
WithoutHref.args = {
  label: "Glucose",
  href: null,
  onClick: null,
}

export const WithSuccessDot = Template.bind({})
WithSuccessDot.args = {
  label: "Glucose",
  href: "/glucose",
  dot: "success",
}

export const WithWarningDot = Template.bind({})
WithWarningDot.args = {
  label: "Glucose",
  href: "/glucose",
  dot: "warning",
}

export const WithErrorDot = Template.bind({})
WithErrorDot.args = {
  label: "Glucose",
  href: "/glucose",
  dot: "error",
}
