import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { Stack } from "@mui/material"
import { StorybookDecorator } from "../components/storybook"
import { IconButton } from "../components/ui/iconbutton"
import { Display, Headline, Title, Body, Label, TypographyProps} from "../components/ui/typography"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Typography",
  component: Display,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
} as ComponentMeta<typeof Display>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const DisplayTemplate: ComponentStory<typeof IconButton> = (args) => <Display {...args}>Display</Display>

export const DisplaySmall = DisplayTemplate.bind({})
DisplaySmall.args = {
  size: "small",
}

export const DisplayMedium = DisplayTemplate.bind({})
DisplayMedium.args = {
  size: undefined,
}

export const DisplayLarge = DisplayTemplate.bind({})
DisplayLarge.args = {
  size: "large",
}

