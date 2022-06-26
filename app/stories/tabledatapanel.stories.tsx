//
// tabledatapanel.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator, Wrapper } from "./helpers/storybook"
import { getTestConnection } from "./helpers/fakedata"
import { TableDataPanel } from "../components/panels/tabledatapanel"

export default {
  title: "Database/TableDataPanel",
  component: TableDataPanel,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    title: "Data",
    icon: "table",
    table: "customers",
    variant: "table",
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof TableDataPanel>

// load database and schema asynchronously, component will then load the actual data
const chinookLoaders = [async () => await getTestConnection("Chinook.db")]
const northwindLoaders = [async () => await getTestConnection("Northwind.db")]
const sakilaLoaders = [async () => await getTestConnection("Sakila.db")]

const Template: ComponentStory<typeof TableDataPanel> = (args, { loaded: { connection, schemas } }) => {
  const { connection: unused, ...restProps } = args
  return (
    <Wrapper>
      <TableDataPanel connection={connection} schema={schemas[0]} {...restProps} />
    </Wrapper>
  )
}
export const Primary = Template.bind({})
Primary.loaders = chinookLoaders

export const WithSakilaView = Template.bind({})
WithSakilaView.loaders = sakilaLoaders
WithSakilaView.args = {
  table: "customer_list",
  variant: "view",
}

export const WithChinookTable = Template.bind({})
WithChinookTable.loaders = chinookLoaders
WithChinookTable.args = {
  table: "invoices",
}

export const WithNorthwindTable = Template.bind({})
WithNorthwindTable.loaders = northwindLoaders
WithNorthwindTable.args = {
  table: "Orders",
}
