//
// tablepanel.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator, Wrapper } from "./helpers/storybook"
import { TablePanel } from "../components/panels/tablepanel"
import { getTestConnection } from "./helpers/fakedata"

export default {
  title: "Tabs/TablePanel",
  component: TablePanel,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    database: "main",
    table: "customer",
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof TablePanel>

const Template: ComponentStory<typeof TablePanel> = (args, { loaded: { connection, schemas } }) => {
  return (
    <Wrapper>
      <TablePanel {...args} connection={connection} database={schemas[0].database} />
    </Wrapper>
  )
}
export const Primary = Template.bind({})
Primary.loaders = [async () => await getTestConnection("Chinook.db")]
Primary.args = {
  table: "invoices",
}

export const WithNorthwind = Template.bind({})
WithNorthwind.loaders = [async () => await getTestConnection("Northwind.db")]
WithNorthwind.args = {
  table: "Customers",
}

export const WithNorthwindView = Template.bind({})
WithNorthwindView.loaders = [async () => await getTestConnection("Northwind.db")]
WithNorthwindView.args = {
  table: "Invoices",
  variant: "view",
}

export const WithSakila = Template.bind({})
WithSakila.loaders = [async () => await getTestConnection("Sakila.db")]
WithSakila.args = {
  table: "film",
}

export const WithSakilaView = Template.bind({})
WithSakilaView.loaders = [async () => await getTestConnection("Sakila.db")]
WithSakilaView.args = {
  table: "customer_list",
  variant: "view",
}
