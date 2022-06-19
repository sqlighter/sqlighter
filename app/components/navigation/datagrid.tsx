//
// datagrid.tsx - convenience wrappers around mui datagrid
//

import React from "react"
import useResizeObserver from "use-resize-observer"
import { Theme, SxProps } from "@mui/material/styles"
import Box from "@mui/material/Box"
import { DataGrid as MuiDataGrid, DataGridProps as MuiDataGridProps, GridColumns } from "@mui/x-data-grid"
import { PanelProps } from "./panel"

//
// DataGrid - display generic data in tabular form
//

const DataGrid_SxProps: SxProps<Theme> = {
  width: 1,
  height: 1,

  ".MuiDataGrid-root": {
    border: "none",
  },
}

export interface DataGridProps extends PanelProps {
  /**
   * Column definitions for table data
   * @see https://mui.com/x/api/data-grid/grid-col-def/
   */
  columns: GridColumns<any>

  /** Data to be displayed in table rows */
  rows?: any[]

  /** Additional properties to be passed straight to the datagrid (optional) */
  dataGridProps?: Omit<MuiDataGridProps, "columns" | "rows">
}

/** Convience wrapper around Mui DataGrid */
export function DataGrid(props: DataGridProps) {
  // grid's parent needs to have its height be > 0 or else the grid will scream so let's track it
  const { ref, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>()

  function handleCommand(event, command, args) {
    if (props.onCommand) {
      console.debug(`DataGrid.sendCommand - ${command}`, args)
      props.onCommand(event, { command, args })
    }
  }

  //
  // render
  //

  // more than 100 rows? use paging
  const paging = props.rows && props.rows.length > 100
  const className = "DataGrid-root" + (props.className ? " " + props.className : "")
  return (
    <Box className={className} ref={ref} sx={DataGrid_SxProps}>
      {width > 20 && height > 20 && (
        <Box sx={{ width: `${width}px`, height: `${height}px` }}>
          <MuiDataGrid
            rows={props.rows}
            columns={props.columns}
            // paging and size
            pageSize={paging ? 100 : undefined}
            rowsPerPageOptions={paging ? [200] : undefined}
            hideFooter={!paging}
            // simple readonly configuration
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            disableSelectionOnClick
            // clicks passed to parent as commands
            onCellClick={(args, event) => handleCommand(event, "dataGridCellClick", args)}
            onCellDoubleClick={(args, event) => handleCommand(event, "dataGridCellDoubleClick", args)}
            onRowClick={(args, event) => handleCommand(event, "dataGridRowClick", args)}
            onRowDoubleClick={(args, event) => handleCommand(event, "dataGridRowDoubleClick", args)}
            // pass additional custom properties
            {...props.dataGridProps}
          />
        </Box>
      )}
    </Box>
  )
}

//
// QueryResultDataGrid
//

export interface QueryResultDataGridProps extends PanelProps {
  /** Query result columns names */
  columns?: string[]
  /** Query result data */
  values?: any[][]
}

/** DataGrid used to show query results */
export function QueryResultDataGrid(props: QueryResultDataGridProps) {
  const columns = props.columns.map((column) => {
    return { field: column, headerName: column, minWidth: 150, editable: false }
  })

  const rows = props.values.map((value, rowIndex) => {
    const valueDict = {}
    columns.forEach((element, columnIndex) => {
      valueDict["id"] = rowIndex
      valueDict[element.field] = value[columnIndex]
    })
    return valueDict
  })

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      onCommand={props.onCommand}
      dataGridProps={{
        autoHeight: false,
        disableColumnMenu: false,
        disableColumnFilter: false,
        disableColumnSelector: false,
      }}
    />
  )
}
