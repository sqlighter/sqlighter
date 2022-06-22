//
// QueryResultDataGrid.tsx - data grid showing result from a query
//

import React from "react"
import { GridColumns, DataGridProps as MuiDataGridProps } from "@mui/x-data-grid"

import { DataTableSchema } from "../../lib/data/connections"
import { DataGrid } from "../navigation/datagrid"
import { PanelProps } from "../navigation/panel"
import {
  COLUMN_FLEX_LARGEST,
  COLUMN_FLEX_LARGE,
  COLUMN_WIDTH_XXL,
  COLUMN_WIDTH_MEDIUM,
  COLUMN_WIDTH_SMALL,
} from "../navigation/datagrid"

// Columns in one of these types are formatted as "number"
const SQL_NUMBER_TYPES = [
  "int",
  "integer",
  "tinyint",
  "smallint",
  "mediumint",
  "bigint",
  "unsigned big int",
  "int2",
  "int8",
  "real",
  "double",
  "double precision",
  "float",
  "numeric",
  "decimal",
]

//
// QueryResultDataGrid
//

export interface QueryResultDataGridProps extends PanelProps {
  /** Table schema helps detecting column types (if available) */
  tableSchema?: DataTableSchema
  /** Query results, list of column names and rows of values */
  result?: { columns: string[]; values: any[][] }
  /** Additional properties to be passed straight to the datagrid (optional) */
  dataGridProps?: Omit<MuiDataGridProps, "columns" | "rows">
}

/** DataGrid used to show query results */
export function QueryResultDataGrid(props: QueryResultDataGridProps) {
  const { tableSchema, result, ...panelProps } = props

  //
  // model
  //

  /** If we have the schema for the table we can attempt to define the type of column to help DataGrid format it correctly */
  function getColumnType(columnName): "number" | undefined {
    const datatype = tableSchema?.columns?.find((c) => c.name == columnName)?.datatype?.toLowerCase()
    if (datatype) {
      if (SQL_NUMBER_TYPES.find((t) => datatype.startsWith(t))) {
        return "number"
      }
    }
    return undefined
  }

  /** Columns to be shown in DataGrid */
  function getColumns(): GridColumns<any> {
    if (result) {
      return result.columns?.map((column) => {
        const columnType = getColumnType(column)
        return {
          field: column,
          headerName: column,
          headerAlign: "left",
          sortable: true,
          type: columnType,
          minWidth: COLUMN_WIDTH_SMALL,
          maxWidth: columnType == "number" ? COLUMN_WIDTH_MEDIUM : COLUMN_WIDTH_XXL,
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

  const className = "QueryResultDataGrid-root" + (props.className ? " " + props.className : "")
  const columns = getColumns()
  const rows = getRows()

  return (
    <DataGrid
      {...panelProps}
      className={className}
      columns={columns}
      rows={rows}
      dataGridProps={{
        autoHeight: false,
        disableColumnMenu: false,
        disableColumnFilter: false,
        disableColumnSelector: false,
        ...props.dataGridProps,
      }}
    />
  )
}
