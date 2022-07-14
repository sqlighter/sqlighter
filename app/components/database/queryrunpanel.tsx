//
// queryrunpanel.tsx - results from a query in tabular form, later charts, plugins, exports, etc...
//

// libs
import React, { useState } from "react"
import { Theme, SxProps } from "@mui/material"
import Box from "@mui/material/Box"

// model
import { DataConnection } from "../../lib/data/connections"
import { QueryRun } from "../../lib/items/query"

// view
import { Command } from "../../lib/commands"
import { QueryResultDataGrid } from "./queryresultdatagrid"
import { IconButtonGroup } from "../ui/iconbuttongroup"
import { PanelProps } from "../navigation/panel"
import { QueryStatus } from "./querystatus"
import { SqlEditor } from "../editor/sqleditor"
import { Body } from "../ui/typography"
import { Empty, MissingFeature } from "../ui/empty"

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
    marginBottom: 2,
    display: "flex",
    alignItems: "center",
  },

  ".QueryRunPanel-status": {
    minWidth: 160,
    width: 180,
    height: 40,
  },

  ".QueryRunPanel-modes": {
    flexGrow: 1,
  },

  ".QueryRunPanel-commands": {
    minWidth: 140,
    width: 140,
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

  "& .MuiToggleButtonGroup-grouped": {
    //    margin: theme.spacing(0.5),
    border: 0,
  },
}

export interface QueryRunPanelProps extends PanelProps {
  /** Database connection used to run this query */
  connection?: DataConnection
  /** Data model for query run shown in panel */
  run: QueryRun
}

// commands used for view modes navigation bar
export const sqlCmd: Command = { command: "viewSql", title: "SQL", icon: "query" }
export const dataCmd: Command = { command: "viewData", title: "Data", icon: "table" }
export const chartCmd: Command = { command: "viewChart", title: "Charts", icon: "chart" }
export const addonCmd: Command = { command: "viewAddon", title: "More", icon: "extension" }

// additional commands shown as icon buttons
export const fullscreenCmd: Command = { command: "fullscreen", title: "Fullscreen", icon: "fullscreen" }
export const shareCmd: Command = { command: "share", title: "Share", icon: "share" }
export const searchCmd: Command = { command: "search", title: "Search", icon: "search" }

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

  async function handleCommand(event, command: Command) {
    console.debug(`QueryRunPanel.handleCommand - command: ${command}`, command)
    switch (command.command) {
      case "viewSql":
      case "viewData":
      case "viewChart":
      case "viewAddon":
        return setMode(command.command)

      // TODO fullscreen, share, search...
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
      <IconButtonGroup
        className="QueryRunPanel-modes"
        selected={mode}
        commands={[sqlCmd, dataCmd]}
        size="medium"
        onCommand={handleCommand}
      />
    )
  }

  function renderCommands() {
    // <IconButton command={fullscreenCmd} onCommand={handleCommand} />
    // <IconButton command={searchCmd} onCommand={handleCommand} />

    const exportCmd: Command = {
      command: "export",
      title: "Export CSV",
      icon: "export",
      args: {
        format: "csv",
        filename: `${props.run?.query?.title || "data"}.csv`,
        connection: props.connection,
        database: props.run.query.database,
        sql: props.run.sql, // will rerun the query
      },
    }

    return (
      <IconButtonGroup
        className="QueryRunPanel-commands"
        // TODO QueryPanel / share button #92
        commands={[exportCmd /*, shareCmd */]}
        size="small"
        onCommand={handleCommand}
      />
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
      return <Empty title="No data" description="This query didn't return any results" icon="code" />
    }
    const result = { columns: run.columns, values: run.values }
    return <QueryResultDataGrid result={result} onCommand={handleCommand} />
  }

  function renderContents() {
    // sql mode is used to display errors too
    if (mode == "viewSql" || run.error) {
      return renderSql()
    }
    if (mode == "viewData") {
      return renderData()
    }
    if (mode == "viewChart") {
      return <MissingFeature />
    }
    return null
  }

  // most controls are shown only once query is done
  const hasCompleted = run.status == "completed" || run.status == "error"

  return (
    <Box className="QueryRunPanel-root" sx={QueryRunPanel_SxProps}>
      <Box className="QueryRunPanel-controls">
        <QueryStatus className="QueryRunPanel-status" connection={props.connection} run={run} />
        {hasCompleted && renderModes()}
        {hasCompleted && renderCommands()}
      </Box>
      {hasCompleted && <Box className="QueryRunPanel-contents">{renderContents()}</Box>}
    </Box>
  )
}
