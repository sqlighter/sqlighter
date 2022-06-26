//
// SchemaPanels.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator, Wrapper } from "./helpers/storybook"
import { getTestConnection, getBlankConnection } from "./helpers/fakedata"
import {
  SchemaPanelWithDataGrid,
  ColumnsSchemaPanel,
  TablesSchemaPanel,
  IndexesSchemaPanel,
  TriggersSchemaPanel,
} from "../components/panels/schemapanels"

export default {
  title: "Database/SchemaPanels",
  component: SchemaPanelWithDataGrid,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    title: "Tables",
    icon: "table",
    table: null,
    variant: "table",
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof SchemaPanelWithDataGrid>

// load database and schema asynchronously
const chinookLoaders = [async () => await getTestConnection("Chinook.db")]
const northwindLoaders = [async () => await getTestConnection("Northwind.db")]
const blankLoaders = [async () => await getBlankConnection()]

const TablesTemplate: ComponentStory<typeof TablesSchemaPanel> = (args, { loaded: { connection, schemas } }) => {
  return (
    <Wrapper>
      <TablesSchemaPanel {...args} connection={connection} schema={schemas[0]} variant="tables" />
    </Wrapper>
  )
}
export const TablesChinook = TablesTemplate.bind({})
TablesChinook.loaders = chinookLoaders
export const TablesBlank = TablesTemplate.bind({})
TablesBlank.loaders = blankLoaders

const ViewsTemplate: ComponentStory<typeof TablesSchemaPanel> = (args, { loaded: { connection, schemas } }) => {
  return (
    <Wrapper>
      <TablesSchemaPanel
        {...args}
        title="Views"
        icon="view"
        connection={connection}
        schema={schemas[0]}
        variant="views"
      />
    </Wrapper>
  )
}
export const ViewsNorthwind = ViewsTemplate.bind({})
ViewsNorthwind.loaders = northwindLoaders
export const ViewsBlank = ViewsTemplate.bind({})
ViewsBlank.loaders = blankLoaders

const IndexesTemplate: ComponentStory<typeof IndexesSchemaPanel> = (args, { loaded: { connection, schemas } }) => {
  return (
    <Wrapper>
      <IndexesSchemaPanel {...args} title="Indexes" icon="index" connection={connection} schema={schemas[0]} />
    </Wrapper>
  )
}
export const IndexesChinook = IndexesTemplate.bind({})
IndexesChinook.loaders = chinookLoaders
export const IndexesChinookFiltered = IndexesTemplate.bind({})
IndexesChinookFiltered.loaders = chinookLoaders
IndexesChinookFiltered.args = {
  // only indexes to specific table
  table: "invoice_items",
  variant: "table",
}
export const IndexesBlank = IndexesTemplate.bind({})
IndexesBlank.loaders = blankLoaders

const TriggersTemplate: ComponentStory<typeof TriggersSchemaPanel> = (args, { loaded: { connection, schemas } }) => {
  return (
    <Wrapper>
      <TriggersSchemaPanel {...args} title="Triggers" icon="trigger" connection={connection} schema={schemas[0]} />
    </Wrapper>
  )
}
export const TriggersChinook = TriggersTemplate.bind({})
TriggersChinook.loaders = chinookLoaders
export const TriggersChinookFiltered = IndexesTemplate.bind({})
TriggersChinookFiltered.loaders = chinookLoaders
TriggersChinookFiltered.args = {
  // only indexes to specific table
  table: "invoice_items",
}
export const TriggersBlank = TriggersTemplate.bind({})
TriggersBlank.loaders = blankLoaders

const ColumnsTemplate: ComponentStory<typeof ColumnsSchemaPanel> = (args, { loaded: { connection, schemas } }) => {
  return (
    <Wrapper>
      <ColumnsSchemaPanel {...args} title="Columns" icon="columns" connection={connection} schema={schemas[0]} />
    </Wrapper>
  )
}
export const ColumnsChinook = ColumnsTemplate.bind({})
ColumnsChinook.loaders = chinookLoaders
ColumnsChinook.args = {
  table: "invoice_items",
}
