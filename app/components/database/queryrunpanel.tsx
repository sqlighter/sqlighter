//
// queryrunpanel.tsx - results from a query in tabular form, later charts, plugins, exports, etc...
//

// libs
import React, { useState } from "react"
import { Theme, SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

// model
import { DataConnection } from "../../lib/sqltr/connections"
import { QueryRun } from "../../lib/items/query"
// view
import { ConnectionIcon } from "./connectionspicker"
import { Command } from "../../lib/commands"
import { DataGrid } from "./datagrid"
import { Icon } from "../ui/icon"
import { IconButton } from "../ui/iconbutton"
import { PanelProps } from "../navigation/panel"
import { QueryStatus } from "./querystatus"

// styles applied to main and subcomponents
const QueryRunPanel_SxProps: SxProps<Theme> = {
  width: 1,
  height: 1,
  maxHeight: 1,

  display: "flex",
  flexDirection: "column",

  ".QueryRunPanel-controls": {
    heigth: 40,
    margin: 1,
    display: "flex",
    alignItems: "center",
  },

  ".QueryRunPanel-status": {
    minWidth: 140,
    flexGrow: 1,
  },

  ".QueryRunPanel-modes": {
    //
  },

  ".QueryRunPanel-commands": {
    minWidth: 140,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
}

export interface QueryRunPanelProps extends PanelProps {
  /** Database connection used to run this query */
  connection?: DataConnection
  /** Data model for query run shown in panel */
  run: QueryRun
}

// commands used for view modes navigation bar
const viewSqlCmd: Command = { command: "viewSql", title: "SQL", icon: "database" }
const viewDataCmd: Command = { command: "viewData", title: "Data", icon: "table" }
const viewChartCmd: Command = { command: "viewChart", title: "Charts", icon: "chart" }
const viewAddonCmd: Command = { command: "viewAddon", title: "More", icon: "extension" }

// additional commands shown as icon buttons
const exportCmd: Command = { command: "export", title: "Export", icon: "export" }
const shareCmd: Command = { command: "share", title: "Share", icon: "share" }
const searchCmd: Command = { command: "search", title: "Search", icon: "search" }

/** Results of a query execution in tabular form, code, charts, etc. */
export function QueryRunPanel(props: QueryRunPanelProps) {
  const run = props.run

  //
  // state
  //

  // which visualization panel is currently visible?
  const [mode, setMode] = useState<string>("viewSql")

  //
  // handlers
  //

  function handleCommand(event, command: Command) {
    console.debug(`QueryRunPanel.handleCommand - command: ${command}`, command)
    switch (command.command) {
      case "viewSql":
      case "viewData":
      case "viewChart":
      case "viewAddon":
        setMode(command.command)
        return
    }

    if (props.onCommand) {
      props.onCommand(event, command)
    }
  }

  //
  // render
  //

  /** Render navigation bar with visualization modes */
  function renderModes() {
    return (
      <Stack className="QueryRunPanel-modes" direction="row">
        <IconButton command={viewSqlCmd} label={true} selected={mode == viewSqlCmd.command} onCommand={handleCommand} />
        <IconButton
          command={viewDataCmd}
          label={true}
          selected={mode == viewDataCmd.command}
          onCommand={handleCommand}
        />
        <IconButton
          command={viewChartCmd}
          label={true}
          selected={mode == viewChartCmd.command}
          onCommand={handleCommand}
        />
      </Stack>
    )
  }

  function renderCommands() {
    return (
      <Stack className="QueryRunPanel-commands" direction="row">
        <IconButton command={exportCmd} onCommand={handleCommand} />
        <IconButton command={shareCmd} onCommand={handleCommand} />
        <IconButton command={searchCmd} onCommand={handleCommand} />
      </Stack>
    )
  }

  return (
    <Box className="QueryRunPanel-root" sx={QueryRunPanel_SxProps}>
      <Box>
        <Box className="QueryRunPanel-controls">
          <Box className="QueryRunPanel-status">
            <QueryStatus connection={props.connection} run={run} />
          </Box>
          {renderModes()}
          {renderCommands()}
        </Box>
      </Box>
      <Box>second row</Box>

      <Box>id: {run.id}</Box>
      <Box>title: {run.query.title}</Box>
      {run.error && <Box>error: {run.error}</Box>}
      {run.rowsModified && <Box>rows modified: {run.rowsModified}</Box>}

      <Box sx={{ flexGrow: 1, height: 1, width: 1 }}>
        {run.columns && run.values && <DataGrid columns={run.columns} values={run.values} />}
      </Box>
    </Box>
  )
}
