//
// queryrunpanel.tsx - results from a query in tabular form, later charts, plugins, exports, etc...
//

// libs
import React, { useState } from "react"
import { Theme, SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"

// model
import { DataConnection } from "../../lib/sqltr/connections"
import { QueryRun } from "../../lib/items/query"

// view
import { Command } from "../../lib/commands"
import { DataGrid } from "./datagrid"
import { IconButton } from "../ui/iconbutton"
import { PanelProps } from "../navigation/panel"
import { QueryStatus } from "./querystatus"
import { SqlEditor } from "../editor/sqleditor"
import { Body } from "../ui/typography"

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
    width: 140,
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

  ".QueryRunPanel-contents": {
    height: 1,
    width: 1,
    flexGrow: 1,
  },

  ".QueryRunPanel-errorLabel": {
    margin: 1,
  },
}

export interface QueryRunPanelProps extends PanelProps {
  /** Database connection used to run this query */
  connection?: DataConnection
  /** Data model for query run shown in panel */
  run: QueryRun
}

// commands used for view modes navigation bar
const sqlCmd: Command = { command: "viewSql", title: "SQL", icon: "database" }
const dataCmd: Command = { command: "viewData", title: "Data", icon: "table" }
const chartCmd: Command = { command: "viewChart", title: "Charts", icon: "chart" }
const addonCmd: Command = { command: "viewAddon", title: "More", icon: "extension" }

// additional commands shown as icon buttons
const fullscreenCmd: Command = { command: "fullscreen", title: "Fullscreen", icon: "fullscreen" }
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
  const [mode, setMode] = useState<string>("viewData")

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
        return setMode(command.command)

      // TODO export, fullscreen, share, search...
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
      <Stack className="QueryRunPanel-modes" direction="row" spacing={1}>
        <IconButton command={sqlCmd} label={true} selected={mode == sqlCmd.command} onCommand={handleCommand} />
        <IconButton command={dataCmd} label={true} selected={mode == dataCmd.command} onCommand={handleCommand} />
      </Stack>
    )
    // <IconButton command={chartCmd} label={true} selected={mode == chartCmd.command} onCommand={handleCommand} />
    // <IconButton command={addonCmd} label={true} selected={mode == addonCmd.command} onCommand={handleCommand} />
  }

  function renderCommands() {
    // <IconButton command={fullscreenCmd} onCommand={handleCommand} />
    // <IconButton command={searchCmd} onCommand={handleCommand} />
    return (
      <Stack className="QueryRunPanel-commands" direction="row">
        <IconButton command={exportCmd} onCommand={handleCommand} />
        <IconButton command={shareCmd} onCommand={handleCommand} />
      </Stack>
    )
  }

  function renderSql() {
    if (run.error) {
      return (
        <Box sx={{ height: 1 }}>
          <Body className="QueryRunPanel-errorLabel">{run.error}</Body>
          <SqlEditor value={run.sql} readOnly={true} />
        </Box>
      )
    }
    return <SqlEditor value={run.sql} readOnly={true} />
  }

  function renderData() {
    if (!run.values) {
      return <>No data</>
    }
    return <DataGrid columns={run.columns} values={run.values} />
  }

  function renderContents() {
    // sql mode is used to display errors too
    if (mode == "viewSql" || run.error) {
      return renderSql()
    }
    if (mode == "viewData") {
      return renderData()
    }
    return <>{mode}/tbd</>
  }

  // most controls are shown only once query is done
  const hasCompleted = run.status == "completed" || run.status == "error"

  return (
    <Box className="QueryRunPanel-root" sx={QueryRunPanel_SxProps}>
      <Box className="QueryRunPanel-controls">
        <Box className="QueryRunPanel-status">
          <QueryStatus connection={props.connection} run={run} />
        </Box>
        {hasCompleted && renderModes()}
        {hasCompleted && renderCommands()}
      </Box>
      {hasCompleted && <Box className="QueryRunPanel-contents">{renderContents()}</Box>}
    </Box>
  )
}
