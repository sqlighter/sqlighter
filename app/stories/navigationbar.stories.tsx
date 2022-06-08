//
// navigatiobar.stories.tsx
//

import React, { useState } from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator } from "../components/storybook"
import { NavigationBar } from "../components/navigation/navigationbar"
import { chartCommand, databaseCommand, queryCommand } from "./fakedata"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Navigation/NavigationBar",
  component: NavigationBar,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    commands: [databaseCommand, queryCommand, chartCommand],
    label: true,
  },
} as ComponentMeta<typeof NavigationBar>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NavigationBar> = (args) => <NavigationBar {...args} />

const SelectableTemplate: ComponentStory<typeof NavigationBar> = (args) => {
  function SelectableBar(props) {
    const [selected, setSelected] = useState(args.selected || args.commands[0].command)
    function handleCommand(e, command) {
      setSelected(command.command)
    }
    return <NavigationBar {...args} selected={selected} onCommand={handleCommand} />
  }
  return <SelectableBar />
}

export const Primary = Template.bind({})

export const Selectable = SelectableTemplate.bind({})

export const WithoutLabels = Template.bind({})
WithoutLabels.args = {
  label: false,
}
