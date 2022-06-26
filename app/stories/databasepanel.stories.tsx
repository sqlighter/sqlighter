//
// databasepanel.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator, Wrapper } from "./helpers/storybook"
import { DatabasePanel } from "../components/panels/databasepanel"
import { getTestConnection, getBlankConnection } from "./helpers/fakedata"

export default {
  title: "Tabs/DatabasePanel",
  component: DatabasePanel,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    title: "Database",
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof DatabasePanel>

const Template: ComponentStory<typeof DatabasePanel> = (args, { loaded: { connection } }) => {
  return (
    <Wrapper>
      <DatabasePanel {...args} connection={connection} />
    </Wrapper>
  )
}
export const Primary = Template.bind({})
Primary.loaders = [async () => await getTestConnection("Chinook.db")]
export const WithBlank = Template.bind({})
WithBlank.loaders = [async () => await getBlankConnection()]
export const WithNorthwind = Template.bind({})
WithNorthwind.loaders = [async () => await getTestConnection("Northwind.db")]
export const WithSakila = Template.bind({})
WithSakila.loaders = [async () => await getTestConnection("Sakila.db")]
