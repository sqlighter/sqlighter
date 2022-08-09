//
// tabs.stories.tsx
//

import React, { useState } from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator, Wrapper } from "./helpers/storybook"
import { Tabs } from "../components/navigation/tabs"
import { Panel } from "../components/navigation/panel"

function Tabber(props) {
  const [tabId, setTabId] = useState(props.tabId)
  const [tabs, setTabs] = useState(props.tabs)
  function handleCommand(event, command) {
    console.debug("handleCommand", command)
    switch (command.command) {
      case "changeTabs":
        console.debug(`handleCommand - changeTabs: ${command.args.tabId}`, command.args)
        setTabId(command.args.tabId)
        setTabs(command.args.tabs)
        return
    }
    props.onCommand(event, command)
  }
  return (
    <Wrapper>
      <Tabs {...props} tabId={tabId} tabs={tabs} onCommand={handleCommand} />
    </Wrapper>
  )
}

export default {
  title: "Navigation/Tabs",
  component: Tabs,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    canClose: true,
    tabId: "tab_1",
    tabs: [1, 2, 3, 4].map((i) => (
      <Panel key={i} id={`tab_${i}`} title={`Tab ${i}`} icon="home">
        Tab {i} (children), try reordering tabs with drag and drop...
      </Panel>
    )),
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof Tabs>

const Template: ComponentStory<typeof Tabs> = (args) => {
  return <Tabber {...args} />
}

export const Primary = Template.bind({})
Primary.args = {
  canClose: false
}

export const WithCloseButton = Template.bind({})
WithCloseButton.args = {
  canClose: true
}
