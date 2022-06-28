//
// iconbuttongroup.stories.tsx
//

import React, { useState } from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator } from "./helpers/storybook"
import { IconButtonGroup } from "../components/ui/iconbuttongroup"
import { sqlCmd, dataCmd, chartCmd, addonCmd } from "./helpers/fakedata"

function Tester(props) {
  const [mode, setMode] = useState(props.selected || props.commands[0].command)
  function handleCommand(e, command) {
    setMode(command.command)
    props.onCommand(e, command)
  }
  return <IconButtonGroup {...props} selected={mode} onCommand={handleCommand} />
}

export default {
  title: "UI/IconButtonGroup",
  component: IconButtonGroup,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    commands: [sqlCmd, dataCmd, chartCmd, addonCmd],
  },
} as ComponentMeta<typeof IconButtonGroup>

const Template: ComponentStory<typeof IconButtonGroup> = (args) => <IconButtonGroup {...args} />
export const Primary = Template.bind({})

export const WithSpacing = Template.bind({})
WithSpacing.args = {
  commands: [sqlCmd, dataCmd, chartCmd, "spacing", addonCmd],
}

export const WithDivider = Template.bind({})
WithDivider.args = {
  commands: [sqlCmd, dataCmd, chartCmd, "divider", addonCmd],
}

const TemplateToggles: ComponentStory<typeof IconButtonGroup> = (args) => <Tester {...args} />
export const Toggles = TemplateToggles.bind({})

export const TogglesWithLabels = TemplateToggles.bind({})
TogglesWithLabels.args = {
  commands: [{ ...sqlCmd, args: { label: true } }, dataCmd, chartCmd, addonCmd],
}

export const TogglesWithGrouping = TemplateToggles.bind({})
TogglesWithGrouping.args = {
  commands: [sqlCmd, dataCmd, chartCmd, "divider", addonCmd],
}
