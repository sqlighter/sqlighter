//
// TableDataPanel.tsx - data tab in table panel
//

// libs
import React, { useState, useEffect } from "react"
import { Theme, SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

// model
import { Command } from "../../lib/commands"
import { DataConnection, DataSchema, DataTableSchema } from "../../lib/data/connections"

// components
import { PanelProps } from "../navigation/panel"
import { QueryResultDataGrid } from "../database/queryresultdatagrid"

// styles shared between all components used to render schema elements
export const TableDataPanel_SxProps: SxProps<Theme> = {
  width: 1,
  height: 1,
  padding: 1,
  paddingTop: 2,

  display: "flex",
  flexDirection: "column",

  ".TableDataPanel-header": {
    paddingLeft: 1,
  },

  ".TableDataPanel-title": {
    marginRight: 1,
  },

  ".TableDataPanel-dataGrid": {
    flexGrow: 1,
    width: 1,
    height: 1,
    overflow: "hidden",
  },
}

export interface TableDataPanelProps extends PanelProps {
  /** Connection rendered by this panel */
  connection: DataConnection
  /** Schema to be shown */
  schema?: DataSchema
  /** Show data in this table */
  table: string
  /** Panel is used to show a table or a view? */
  variant: "table" | "view"
}

/** Shows list of columns in a table or view */
export function TableDataPanel(props: TableDataPanelProps) {
  //
  // state
  //

  let tableSchema: DataTableSchema
  if (props.schema) {
    tableSchema =
      props.variant == "view"
        ? props.schema.views?.find((v) => v.name.toLowerCase() == props.table.toLowerCase())
        : props.schema.tables.find((t) => t.name.toLowerCase() == props.table.toLowerCase())
  }

  const [result, setResult] = useState<any>()

  useEffect(() => {
    if (tableSchema) {
      const fetchData = async () => {
        // TODO instead of forcing a limit on the query we should paginate results
        const result = await props.connection.getResult(`select * from "${props.table}" limit 1000`)
        setResult(result)
        console.debug("TableDataPanel: fetched data", result)
      }
      fetchData().catch(console.error)
    }
  }, [tableSchema])

  //
  // handlers
  //

  function handleCommand(event, command: Command) {
    // console.debug(`TableDataPanel.handleCommand - ${command.command}`, command)
    if (props.onCommand) {
      props.onCommand(event, command)
    }
  }

  //
  // render
  //

  return (
    <Box className="TableDataPanel-root" sx={TableDataPanel_SxProps}>
      <Box className="TableDataPanel-header">
        <Typography className="TableDataPanel-title" variant="h6" sx={{ mr: 1 }}>
          {result?.values?.lenght > 1
            ? `${result.values.length} rows x ${result.column.length} columns`
            : props.title}
        </Typography>
      </Box>
      {result && (
        <QueryResultDataGrid
          className="TableDataPanel-dataGrid"
          tableSchema={tableSchema}
          result={result}
          onCommand={handleCommand}
        />
      )}
    </Box>
  )
}
