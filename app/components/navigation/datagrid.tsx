//
// datagrid.tsx - convenience wrappers around mui datagrid
//

import React, { useEffect } from "react"
import useResizeObserver from "use-resize-observer"
import { Theme, SxProps } from "@mui/material/styles"
import Box from "@mui/material/Box"
import {
  DataGrid as MuiDataGrid,
  DataGridProps as MuiDataGridProps,
  GridColumns,
  GridInputSelectionModel,
} from "@mui/x-data-grid"
import { PanelProps } from "./panel"

// standardize column widths on few sizes
export const COLUMN_WIDTH_SMALL = 100
export const COLUMN_WIDTH_MEDIUM = 160
export const COLUMN_WIDTH_LARGE = 240
export const COLUMN_WIDTH_XXL = 400
export const COLUMN_WIDTH_PER_COMMAND = 40 // a command icon is 28px

// standardize column flexes on few relative sizes
export const COLUMN_FLEX_LARGE = 2
export const COLUMN_FLEX_LARGEST = 3

//
// DataGrid - display generic data in tabular form
//

const DataGrid_SxProps: SxProps<Theme> = {
  width: 1,
  height: 1,

  ".MuiDataGrid-root": {
    border: "none",
    borderRadius: "0px",
  },

  ".MuiDataGrid-columnHeaders": {
    borderRadius: "0px",
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

  /** Rows that should be selected initially (optional) */
  selection?: GridInputSelectionModel

  /** Additional properties to be passed straight to the datagrid (optional) */
  dataGridProps?: Omit<MuiDataGridProps, "columns" | "rows">
}

/** Convience wrapper around Mui DataGrid */
export function DataGrid(props: DataGridProps) {
  //
  // state
  //

  // rows that are currently selected
  const [selectionModel, setSelectionModel] = React.useState<GridInputSelectionModel>(props.selection || [])
  function handleSelectionModelChange(newSelectionModel: GridInputSelectionModel) {
    console.debug(`handleSelectionModelChange`, newSelectionModel)
    setSelectionModel(newSelectionModel)
    // dispatch as command?
  }
  useEffect(() => {
    setSelectionModel(props.selection ? props.selection : [])
  }, [props.selection])

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
            rowsPerPageOptions={paging ? [100] : undefined}
            hideFooter={!paging}
            // simple readonly configuration
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            // selection
            disableSelectionOnClick={false} //{props.selection ? false : true}
            selectionModel={selectionModel}
            onSelectionModelChange={handleSelectionModelChange}
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
