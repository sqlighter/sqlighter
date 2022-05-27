//
// queryresultspanel.tsx - results from a query in tabular form, later charts, plugins, exports, etc...
//

import Box from "@mui/material/Box"
import { DataGrid } from "./datagrid"
import { PanelProps } from "../navigation/panel"

// TODO move with data models
export interface QueryExecResult {
  id?: string
  title?: string

  startedOn: any
  completedOn?: any

  status: "running" | "completed" | "error"
  error?: any

  columns?: any
  values?: any

  children?: React.ReactFragment
}

export interface QueryResultsPanelProps extends PanelProps {
  result: QueryExecResult

  //  startedOn: any
  //  completedOn?: any

  //  status: "running" | "completed" | "error"
  //  error?: any

  //  columns?: any
  //  values?: any
}

// @param {import("sql.js").QueryExecResult} props

export function QueryResultsPanel(props: QueryResultsPanelProps) {
  //
  // handlers
  //

  //
  // render
  //

  const result = props.result
  return (
    <Box
      sx={{ width: 1, height: 1, maxHeight: 1, backgroundColor: "orange", display: "flex", flexDirection: "column" }}
    >
      <Box>id: {result.id}</Box>
      <Box>status: {result.status}</Box>
      <Box>title: {result.title}</Box>
      {result.error && <Box>error: {result.error}</Box>}
      <Box sx={{ flexGrow: 1, width: 1 }}>
        {result.columns && result.values && <DataGrid columns={result.columns} values={result.values} />}
      </Box>
    </Box>
  )
}
