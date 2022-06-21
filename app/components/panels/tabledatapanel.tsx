//
// TableDataPanel.tsx - data tab in table panel
//

// libs
import React, { useState, useEffect } from "react"
import { Theme, SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { GridColumns } from "@mui/x-data-grid"

// model
import { Command } from "../../lib/commands"
import { DataConnection, DataSchema, DataTableSchema } from "../../lib/data/connections"

// components
import { DataGrid } from "../navigation/datagrid"
import { PanelProps } from "../navigation/panel"
import { COLUMN_FLEX_LARGEST, COLUMN_FLEX_LARGE, COLUMN_WIDTH_MEDIUM, COLUMN_WIDTH_SMALL } from "./schemapanels"

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

  ".MuiDataGrid-root": {
    border: "none",
    borderRadius: "0px",
  },

  ".MuiDataGrid-columnHeaders": {
    borderRadius: "0px",
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
        const result = await props.connection.getResult(`select * from "${props.table}" limit 1000`)
        setResult(result)
      }
      fetchData().catch(console.error)
    }
  }, [tableSchema])

  //
  // model
  //

  /** Columns to be shown in DataGrid */
  function getColumns(): GridColumns<any> {
    /** Returns true if given column is numeric */
    function getColumnType(columnName): "number" | undefined {
      const datatype = tableSchema?.columns?.find((c) => c.name == columnName)?.datatype?.toLowerCase()
      if (datatype) {
        if (datatype.indexOf("integer") != -1 || datatype.indexOf("numeric") != -1 || datatype.indexOf("real") != -1) {
          return "number"
        }
      }
      return undefined
    }

    if (tableSchema) {
      return tableSchema.columns?.map((column, columnIndex) => {
        const columnType = getColumnType(column.name)
        return {
          field: column.name,
          headerName: column.name,
          headerAlign: "left",
          sortable: true,
          type: columnType,
          minWidth: COLUMN_WIDTH_SMALL,
          width: columnType == "number" ? COLUMN_WIDTH_SMALL : COLUMN_WIDTH_MEDIUM,
          flex: columnType == "number" ? COLUMN_FLEX_LARGE : COLUMN_FLEX_LARGEST,
        }
      })
    }
    return []
  }

  /** Rows to be shown in DataGrid, dictionaries, one per line */
  function getRows(): any[] {
    if (result) {
      return result.values.map((value, rowIndex) => {
        const valueDict = {}
        result.columns.forEach((column, columnIndex) => {
          valueDict["id"] = rowIndex
          valueDict[column] = value[columnIndex]
        })
        return valueDict
      })
    }
  }

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

  const columns = getColumns()
  const rows = getRows() || []
  return (
    <Box className="TableDataPanel-root" sx={TableDataPanel_SxProps}>
      <Box className="TableDataPanel-header">
        <Typography className="TableDataPanel-title" variant="h6" sx={{ mr: 1 }}>
          {tableSchema?.stats?.rows > 1
            ? `${tableSchema.stats.rows} rows x ${tableSchema.columns?.length} columns`
            : props.title}
        </Typography>
      </Box>
      {columns && (
        <DataGrid
          className="TableDataPanel-dataGrid"
          columns={columns}
          rows={rows}
          onCommand={handleCommand}
          dataGridProps={{
            autoHeight: false,
            disableColumnMenu: false,
            disableColumnFilter: false,
            disableColumnSelector: false,
          }}
        />
      )}
    </Box>
  )
}
