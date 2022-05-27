//
// datagrid.tsx - shows query results in tabular form
//

import { DataGrid as MuiDataGrid } from "@mui/x-data-grid"

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
      <MuiDataGrid
        rows={rows}
        columns={columns}
        pageSize={50}
        rowsPerPageOptions={[10, 50, 100]}
        checkboxSelection
        disableSelectionOnClick
      />
    )
  }

  return null
}
