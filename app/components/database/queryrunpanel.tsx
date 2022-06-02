//
// queryrunpanel.tsx - results from a query in tabular form, later charts, plugins, exports, etc...
//

import React from "react"
import Box from "@mui/material/Box"

import { DataGrid } from "./datagrid"
import { PanelProps } from "../navigation/panel"
import { Command } from "../../lib/commands"
import { IconButton } from "../ui/iconbutton"
import { QueryRun } from "../../lib/items/query"

export interface QueryRunPanelProps extends PanelProps {
  /** Data model for query run shown in panel */
  run: QueryRun
}

/** Results of a query execution in tabular form, code, charts, etc. */
export function QueryRunPanel(props: QueryRunPanelProps) {
  const run = props.run

  //
  // handlers
  //

  function handleCommand(event, command: Command) {
    console.debug(`QueryRunPanel.handleCommand - command: ${command}`, command)
    if (props.onCommand) {
      props.onCommand(event, command)
    }
  }

  //
  // render
  //

  const command = {
    command: "print",
    icon: "database",
  }

  return (
    <Box sx={{ width: 1, height: 1, maxHeight: 1, display: "flex", flexDirection: "column" }}>
      <Box>id: {run.id}</Box>
      <Box>
        status: {run.status} <IconButton command={command} onCommand={handleCommand} />
      </Box>
      <Box>title: {run.query.title}</Box>
      {run.error && <Box>error: {run.error}</Box>}
      {run.rowsModified &&<Box>rows modified: {run.rowsModified}</Box>}
      <Box sx={{ flexGrow: 1, height: 1, width: 1 }}>
        {run.columns && run.values && <DataGrid columns={run.columns} values={run.values} />}
      </Box>
    </Box>
  )
}
