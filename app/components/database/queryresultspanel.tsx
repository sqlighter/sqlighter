//
// queryresultspanel.tsx - results from a query in tabular form, later charts, plugins, exports, etc...
//

import Box from "@mui/material/Box"
import { DataGrid } from "./datagrid"
import { PanelProps } from "../navigation/panel"

import { TabProps } from "../navigation/tabs"

// TODO move with data models
export interface QueryResultsPanelProps extends TabProps {

  startedOn: any
  completedOn?: any

  status: "running" | "completed" | "error"
  error?: any

  columns?: any
  values?: any
}


// @param {import("sql.js").QueryExecResult} props

export function QueryResultsPanel(props: QueryResultsPanelProps) {
  //
  // handlers
  //

  //
  // render
  //

  return (
    <Box
      sx={{ width: 1, height: 1, maxHeight: 1, backgroundColor: "orange", display: "flex", flexDirection: "column" }}
    >
      <Box>id: {props.id}</Box>
      <Box>status: {props.status}</Box>
      <Box>title: {props.title}</Box>
      {props.error && <Box>error: {props.error}</Box>}
      <Box sx={{ flexGrow: 1, width: 1 }}>
        {props.columns && props.values && <DataGrid columns={props.columns} values={props.values} />}
      </Box>
    </Box>
  )
}
