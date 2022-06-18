//
// datagrid.tsx - shows query results in tabular form
//

import React from "react"
import useResizeObserver from "use-resize-observer"
import { Theme, SxProps } from "@mui/material/styles"
import Box from "@mui/material/Box"
import { DataGrid as MuiDataGrid } from "@mui/x-data-grid"

const DataGrid_SxProps: SxProps<Theme> = {
  width: 1, 
  height: 1,

  ".MuiDataGrid-root": {
    border: "none"
  }
}

export interface DataGridProps {
  /**
   * Columns in the result (array of names)
   * @see import("sql.js").QueryExecResult
   */
  columns?: any

  /** Dictionary of arrays of values for the resulting rows */
  values?: any
}

/**
 * Renders a single value of the array returned by db.exec(...) as a table
 * @param {import("sql.js").QueryExecResult} props
 */
export function DataGrid(props: DataGridProps) {
  // grid's parent needs to have its height be > 0 or else the grid will scream so let's track it
  const { ref, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>()

  //
  // render
  //

  function renderGrid() {
    if (props.columns && props.values) {
      const columns = props.columns.map((column) => {
        return { field: column, headerName: column, minWidth: 150, editable: true }
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
        <Box sx={{ width: `${width}px`, height: `${height}px` }}>
          <MuiDataGrid
            rows={rows}
            columns={columns}
            pageSize={100}
            rowsPerPageOptions={[100]}
            disableSelectionOnClick
          />
        </Box>
      )
    }
  }

  // console.debug(`DataGrid - ${width}x${height}`)
  return (
    <Box className="DataGrid-root" ref={ref} sx={DataGrid_SxProps}>
      {width > 20 && height > 20 && renderGrid()}
    </Box>
  )
}
