//
// schemapanels.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { Box } from "@mui/material"
import { StorybookDecorator, Wrapper } from "../components/storybook"
import { DatabasePanel } from "../components/panels/databasepanel"
import {
  SchemaPanelWithDataGrid,
  TablesSchemaPanel,
  IndexesSchemaPanel,
  TriggersSchemaPanel,
} from "../components/panels/schemapanels"
import { getTestConnection, getBlankConnection } from "./fakedata"

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
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof SchemaPanelWithDataGrid>

// load database and schema asynchronously
const chinookLoaders = [async () => await getTestConnection("Chinook.db")]
const northwindLoaders = [async () => await getTestConnection("Northwind.db")]
const blankLoaders = [async () => await getBlankConnection()]

const TablesTemplate: ComponentStory<typeof DatabasePanel> = (args, { loaded: { connection, schemas } }) => {
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

const ViewsTemplate: ComponentStory<typeof DatabasePanel> = (args, { loaded: { connection, schemas } }) => {
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

const IndexesTemplate: ComponentStory<typeof DatabasePanel> = (args, { loaded: { connection, schemas } }) => {
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
}
export const IndexesBlank = IndexesTemplate.bind({})
IndexesBlank.loaders = blankLoaders

const TriggersTemplate: ComponentStory<typeof DatabasePanel> = (args, { loaded: { connection, schemas } }) => {
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
