import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { fireEvent, screen, userEvent } from '@storybook/testing-library';
import { Stack } from "@mui/material"
import { Command } from "../lib/commands"

import { StorybookDecorator } from "./decorator"
import { IconButton } from "../components/ui/iconbutton"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/IconButton",
  component: IconButton,
/*
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],*/
} as ComponentMeta<typeof IconButton>

const databaseCommand: Command = {
  command: "openDatabase",
  title: "Open Database",
  icon: "database",
}
const queryCommand: Command = {
  command: "openQuery",
  title: "Open Query",
  icon: "query",
}
const printCommand: Command = {
  command: "print",
  title: "Print",
  icon: "print",
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof IconButton> = (args) => <IconButton {...args} />

const TemplateStack: ComponentStory<typeof IconButton> = (args) => (
  <Stack direction="row">
    <IconButton {...args} command={databaseCommand} />
    <IconButton {...args} command={queryCommand} />
    <IconButton {...args} command={printCommand} />
  </Stack>
)

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Primary = Template.bind({})
Primary.args = {
  command: {
    command: "openDatabase",
    title: "Open Database",
    icon: "database",
  },
}
Primary.play = async () => {
  const button = document.querySelector(".IconButton-root")
  userEvent.click(button)
};

export const Small = Template.bind({})
Small.args = {
  size: "small",
  command: {
    command: "openDatabase",
    title: "Open Database",
    icon: "database",
  },
}

export const WithoutTooltip = Template.bind({})
WithoutTooltip.args = {
  command: {
    command: "openDatabase",
    // title: "Open Database",
    icon: "database",
  },
}

export const Stacked = TemplateStack.bind({})
Stacked.args = {}
