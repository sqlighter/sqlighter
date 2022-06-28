//
// tabledatapanel.stories.tsx
//

import React, { useState, useEffect } from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import Box from "@mui/material/Box"

import { StorybookDecorator } from "./helpers/storybook"
import { getTestConnection } from "./helpers/fakedata"
import { QueryResultDataGrid } from "../components/database/queryresultdatagrid"

function TableLoadingWrapper(props) {
  const [result, setResult] = useState()
  const [tableSchema, setTableSchema] = useState()
  useEffect(() => {
    console.debug(`Wrapper.useEffect - table: ${props.table}, useTableSchema: ${props.useTableSchema}`, props)
    if (props.connection) {
    }
    const getResults = async () => {
      // retrieve data from actual database
      setResult(await props.connection.getResult(`select * from "${props.table}"`))
      // table schema?
      const tableSchema = props.useTableSchema && props.schemas?.[0]?.tables?.find((s) => s.name == props.table)
      setTableSchema(tableSchema)
    }
    getResults().catch(console.error)
  }, [props.connection, props.table, props.useTableSchema])

  return (
    <Box sx={{ height: "500px", width: 1 }}>
      <QueryResultDataGrid result={result} tableSchema={tableSchema} />
    </Box>
  )
}

export default {
  title: "Database/QueryResultDataGrid",
  component: QueryResultDataGrid,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],

  args: {
    /** Name of table shown in grid */
    table: "customers",
    /** Table's parent height */
    height: "400px",
    /** Should pass table schema to component? */
    useTableSchema: true,
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof QueryResultDataGrid>

// load database and schema asynchronously, component will then load the actual data
const chinookLoaders = [async () => await getTestConnection("Chinook.db")]
const northwindLoaders = [async () => await getTestConnection("Northwind.db")]
const sakilaLoaders = [async () => await getTestConnection("Sakila.db")]

const Template: ComponentStory<any> = (args, { loaded: { connection, schemas } }) => {
  return (
    <TableLoadingWrapper
      connection={connection}
      schemas={schemas}
      table={args.table}
      useTableSchema={args.useTableSchema}
    />
  )
}
export const Primary = Template.bind({})
Primary.loaders = chinookLoaders

export const WithSakilaFilm = Template.bind({})
WithSakilaFilm.loaders = sakilaLoaders
WithSakilaFilm.args = {
  // useTableSchema: true,
  table: "film",
}

export const WithSakilaFilmNoSchema = Template.bind({})
WithSakilaFilmNoSchema.loaders = sakilaLoaders
WithSakilaFilmNoSchema.args = {
  useTableSchema: false,
  table: "film",
}

export const WithChinookInvoices = Template.bind({})
WithChinookInvoices.loaders = chinookLoaders
WithChinookInvoices.args = {
  table: "invoices",
}

export const WithNorthwindOrders = Template.bind({})
WithNorthwindOrders.loaders = northwindLoaders
WithNorthwindOrders.args = {
  table: "Orders",
}
