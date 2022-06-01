//
// querypanel.tsx - panel used to edit and run database queries, show results
//

import React from "react"
import { useState } from "react"

import { Allotment } from "allotment"
import "allotment/dist/style.css"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"

import { Command } from "../../lib/commands"
import { DataConnection } from "../../lib/sqltr/connections"

import { Icon } from "../ui/icon"
import { PanelProps } from "../navigation/panel"
import { Tabs } from "../navigation/tabs"

import { ConnectionPicker } from "./connectionspicker"
import { SqlEditor } from "../editor/sqleditor"
import Query, { QueryRun } from "../../lib/items/query"
import { QueryRunPanel } from "./queryrunpanel"
import { useForceUpdate } from "../hooks/useforceupdate"

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

export interface QueryPanelProps extends PanelProps {
  /** All available data connections */
  connections?: DataConnection[]
  /** Query data model, includes query runs shown in tabs */
  query: Query
}

/** Panel used to edit and run database queries, show results  */
export function QueryPanel(props: QueryPanelProps) {
  // data model for the query
  const query = props.query

  // connection used by the query
  const connection = props.connections.find((c) => c.id == query.connectionId)
  if (!connection) {
    console.error(`QueryPanel - connection ${query.connectionId} not found`)
  }

  //
  // state
  //

  // currently selected run
  const [runId, setRunId] = useState<string>(query?.runs?.[0]?.id)

  // results shown below sql or to the right?
  const [variant, setVariant] = useState<"bottom" | "right">("bottom")

  // used to force a refresh when data model changes
  const forceUpdate = useForceUpdate()

  //
  // running query
  //

  async function runQuery(e: React.SyntheticEvent) {
    if (!connection) {
      // TODO ask user to pick a connection from connection picker
      return
    }

    // create a tab that is shown while the query is being executed to display progress, etc.
    const running = new QueryRun()
    running.parentId = query.id
    running.query = query
    running.status = "running"
    running.sql = query.sql

    // add run, update query watchers
    console.debug(`QueryPanel.runQuery - running`, running)
    query.runs = query.runs ? [running, ...query.runs] : [running]
    setRunId(running.id)
    forceUpdate()

    try {
      // TODO split sql into separate statements and run each query separately in sequence to provide correct stats
      const queryResults = await connection.getResults(query.sql)

      // TODO remove artificial delay used only to develop "in progress" updates
      await delay(200)

      // first query completed normally
      running.status = "completed"
      running.updatedAt = new Date()
      running.columns = queryResults[0].columns
      running.values = queryResults[0].values
      console.debug(`QueryPanel.runQuery - completed`, running)

      if (queryResults.length > 1) {
        const baseTitle = running.title
        running.title += " (1)"

        for (let i = 1; i < queryResults.length; i++) {
          const additionalRun = new QueryRun()
          additionalRun.parentId = query.id
          additionalRun.query = running.query
          additionalRun.title = `${baseTitle} (${i + 1})`
          additionalRun.createdAt = running.createdAt
          additionalRun.updatedAt = new Date()
          additionalRun.status = "completed"
          additionalRun.sql = running.sql
          additionalRun.columns = queryResults[i].columns
          additionalRun.values = queryResults[i].values

          // add tab to runs
          query.runs.splice(i, 0, additionalRun)
        }
      }
    } catch (exception) {
      // an error was thrown during query execution
      running.status = "error"
      running.error = exception.toString()
    }

    // update first tab with first result of current query
    // refresh entire list also adding any new additional tabs
    forceUpdate()
  }

  //
  // handlers
  //

  async function handleCommand(e: React.SyntheticEvent, command: Command) {
    console.debug(`QueryPanel.handleCommand - ${command.command}`, command)
    switch (command.command) {
      case "editor.changeValue":
        query.sql = command.args.value
        // does NOT need a forceUpdate since the editor's model is not controlled
        break

      case "tabs.changeTabs":
        // extract data models from views, update query, notify viewers
        query.runs = command.args.tabs.map((tab) => tab.props.run)
        setRunId(command.args.tabId)
        forceUpdate()
        break

      case "toggleResults":
        setVariant(variant == "bottom" ? "right" : "bottom")
        return

      case "changeConnection":
        query.connectionId = command.args?.connection?.id
        forceUpdate()
        break
    }
  }

  //
  // render
  //

  const HEADER_HEIGHT = 150
  const MAIN_HEIGHT = 200

  function renderHeader() {
    return (
      <Box className="PanelWithResults-header" sx={{ display: "flex", height: HEADER_HEIGHT, m: 1 }}>
        <Box className="QueryTab-header-left" sx={{ flexGrow: 1 }}>
          <Box>
            <TextField id="outlined-basic" variant="outlined" value={props.title} />
          </Box>
        </Box>
        <Box className="QueryTab-header-right">
          <Box sx={{ display: "flex" }}>
            <Button variant="contained" onClick={runQuery} startIcon={<Icon>play</Icon>} sx={{ mr: 1 }}>
              Run all
            </Button>
          </Box>
          <ConnectionPicker connection={connection} connections={props.connections} onCommand={handleCommand} />
        </Box>
      </Box>
    )
  }

  function renderEditor() {
    return <SqlEditor value={query.sql} onCommand={handleCommand} />
  }

  function renderRuns() {
    const toggleResults = {
      command: variant == "bottom" ? "toggleResults" : "toggleResults",
      icon: variant == "bottom" ? "tabsRight" : "tabsBottom",
      title: variant == "bottom" ? "Results to the right" : "Results at the bottom",
    }

    const runs = query.runs
    if (runs && runs.length > 0) {
      const tabs = runs.map((run) => {
        const runClone = Object.assign(new QueryRun(), run)
        return <QueryRunPanel key={run.id} id={run.id} title={run.title} run={runClone} />
      })
      return <Tabs tabId={runId} tabs={tabs} tabsCommands={[toggleResults]} onCommand={handleCommand} />
    }

    // TODO show empty state, eg empty tray icon + your results will appear here or similar
    return <>No results yet</>
  }

  /**
   * Render the split panel with editor on top and results below or
   * editor on the left and result below. An easier version of this code
   * would simply use vertical={variant == 'bottom'} however for some
   * reason due to how react/allotment refresh it doesn't work. Instead
   * we add a box that makes the two versions different and hence require
   * a whole updated render.
   */
  function renderAlloment() {
    if (variant == "bottom") {
      return (
        <Allotment className={`QueryPanel-bottomResults`} vertical={true} proportionalLayout={true}>
          <Allotment.Pane>{renderEditor()}</Allotment.Pane>
          <Allotment.Pane>{renderRuns()}</Allotment.Pane>
        </Allotment>
      )
    } else {
      return (
        <Box sx={{ width: 1, height: 1 }}>
          <Allotment className={`QueryPanel-rightResults`} vertical={false} proportionalLayout={true}>
            <Allotment.Pane>{renderEditor()}</Allotment.Pane>
            <Allotment.Pane>{renderRuns()}</Allotment.Pane>
          </Allotment>
        </Box>
      )
    }
  }

  return (
    <Box className="QueryPanel-root" sx={{ width: 1, height: 1, maxHeight: 1 }}>
      <Allotment vertical={true}>
        <Allotment.Pane minSize={150} maxSize={150}>
          {renderHeader()}
        </Allotment.Pane>
        <Allotment.Pane>
          <Box sx={{ width: 1, height: 1 }}>{renderAlloment()}</Box>
        </Allotment.Pane>
      </Allotment>
    </Box>
  )
}
