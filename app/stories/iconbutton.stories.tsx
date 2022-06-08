import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { fireEvent, screen, userEvent, waitFor, within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"
import { Stack } from "@mui/material"
import { Command } from "../lib/commands"
import { StorybookDecorator } from "../components/storybook"
import { IconButton } from "../components/ui/iconbutton"
import { chartCommand, databaseCommand, queryCommand } from "./fakedata"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/IconButton",
  component: IconButton,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    command: databaseCommand,
  },
} as ComponentMeta<typeof IconButton>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof IconButton> = (args) => <IconButton {...args} />

const TemplateStack: ComponentStory<typeof IconButton> = (args) => (
  <Stack direction="row">
    <IconButton {...args} command={databaseCommand} />
    <IconButton {...args} command={queryCommand} />
    <IconButton {...args} command={chartCommand} />
  </Stack>
)

const TemplateSizes: ComponentStory<typeof IconButton> = (args) => (
  <Stack direction="row" sx={{ display: "flex", alignItems: "flex-start" }}>
    <IconButton {...args} command={databaseCommand} size="small" />
    <IconButton {...args} command={databaseCommand} size="medium" />
    <IconButton {...args} command={databaseCommand} size="large" />
  </Stack>
)

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Primary = Template.bind({})

export const Small = Template.bind({})
Small.args = {
  size: "small",
}

export const Large = Template.bind({})
Large.args = {
  size: "large",
}

export const Sizes = TemplateSizes.bind({})

export const Stacked = TemplateStack.bind({})

export const StackedWithLabels = TemplateStack.bind({})
StackedWithLabels.args = {
  label: true
}

export const WithLabel = Template.bind({})
WithLabel.args = {
  command: {
    command: "print",
    title: "Print",
    icon: "print",
  },
  label: true,
}

export const WithoutTooltip = Template.bind({})
WithoutTooltip.args = {
  command: {
    command: "openDatabase",
    // title: "Open Database",
    icon: "database",
  },
}

// Automatic tests
// https://storybook.js.org/tutorials/ui-testing-handbook/
// https://playwright.dev/

export const Autotesting = Template.bind({})
Autotesting.args = {
  withLabel: true,
  command: {
    command: "openDatabase",
    title: "Open Database",
    icon: "database",
  },
}
Autotesting.play = async () => {
  const button = document.querySelector(".IconButton-root")

  // check tooltip
  userEvent.hover(button)

  // no tooltip right away
  const tooltip1 = screen.queryAllByText(databaseCommand.title as string)
  expect(tooltip1).toHaveLength(0)

  // tooltip shows after a delay
  // https://testing-library.com/docs/dom-testing-library/api-async#waitfor
  await waitFor(
    () => {
      const tooltip2 = screen.getByRole("tooltip")
      expect(tooltip2).toHaveTextContent(databaseCommand.title)
    },
    { timeout: 2500 }
  )

  userEvent.unhover(button)

  // tooltip goes away after a delay
  await waitFor(
    () => {
      const tooltip4 = screen.queryAllByText("Open Database")
      expect(tooltip4).toHaveLength(0)
    },
    { timeout: 500 }
  )

  // TODO run a test similar to the one in iconbutton.test.tsx where button is clicked, command event checked
  //  const handleClick = jest.fn()
  //  const mockCallback = jest.fn()
  // button.addEventListener("onCommand", (e, command) => {
  //   console.debug(command)
  // })

  userEvent.click(button)
}
