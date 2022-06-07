//
// querypanel.tsx - panel used to edit and run database queries, show results
//

// libs
import React from "react"
import { useState } from "react"
import { Theme, SxProps } from "@mui/material"
import { Allotment } from "allotment"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import Stack from "@mui/material/Stack"
import useMediaQuery from "@mui/material/useMediaQuery"

// model
import { Command } from "../../lib/commands"
import { DataConnection } from "../../lib/sqltr/connections"
import Query, { QueryRun } from "../../lib/items/query"

// components
import { Icon } from "../ui/icon"
import { IconButton } from "../ui/iconbutton"
import { PanelProps } from "../navigation/panel"
import { Tabs } from "../navigation/tabs"
import { ConnectionPicker } from "./connectionpicker"
import { SqlEditor } from "../editor/sqleditor"
import { QueryRunPanel } from "./queryrunpanel"
import { useForceUpdate } from "../hooks/useforceupdate"
import { TitleField } from "../ui/titlefield"
import { Empty } from "../ui/empty"

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

// styles applied to main and subcomponents
const QueryPanel_SxProps: SxProps<Theme> = {
  width: 1,
  minWidth: 420,
  height: 1,
  maxHeight: 1,

  paddingTop: 2,
  paddingLeft: 1,
  paddingRight: 1,
  paddingBottom: 1,

  display: "flex",
  flexDirection: "column",

  // area with title, connections picker, run button, commands
  ".QueryPanel-header": {
    width: 1,
    paddingBottom: 2,
  },

  ".QueryPanel-title": {
    flexGrow: 1,
    paddingLeft: 0.75,
  },

  ".QueryPanel-commands": {
    paddingTop: 0.5,
  },

  ".QueryPanel-run": {
    height: 36,
    width: 100,
  },

  // stacked editor and results
  ".QueryPanel-bottomResults": {
    ".QueryPanel-editorBox": {
      width: 1,
      height: 1,
      display: "flex",
      flexDirection: "column",
      paddingBottom: "6px",
    },
    ".QueryPanel-resultsBox": {
      width: 1,
      height: 1,
      display: "flex",
      flexDirection: "column",
      paddingTop: "2px",
    },
  },

  // editor and results side by side
  ".QueryPanel-rightResults": {
    ".QueryPanel-editorBox": {
      width: 1,
      height: 1,
      display: "flex",
      flexDirection: "column",
      paddingRight: "6px",
    },
    ".QueryPanel-resultsBox": {
      width: 1,
      height: 1,
      display: "flex",
      flexDirection: "column",
      paddingLeft: "2px",
    },
  },

  ".QueryPanel-card": {
    flexGrow: 1,
    width: 1,
    overflow: "hidden",
  },
}

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
  const connection = props.connections?.find((c) => c.id == query.connectionId)
  if (!connection) {
    console.error(`QueryPanel - connection ${query.connectionId} not found`)
  }

  //
  // state
  //

  // layout changes on medium and large screens
  const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"))

  // currently selected run
  const [runId, setRunId] = useState<string>(query?.runs?.[0]?.id)

  // results shown below sql or to the right?
  const [variant, setVariant] = useState<"bottom" | "right">("bottom")

  // used to force a refresh when data model changes
  const forceUpdate = useForceUpdate()
  function notifyChanges() {
    forceUpdate()
    if (props.onCommand) {
      props.onCommand(null, {
        command: "changeQuery",
        args: {
          item: query,
        },
      })
    }
  }

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
    notifyChanges()

    try {
      // TODO split sql into separate statements and run each query separately in sequence to provide correct stats
      // see https://sql.js.org/documentation/Database.html#%5B%22iterateStatements%22%5D
      const queryResults = await connection.getResults(query.sql)
      console.debug(`QueryPanel.runQuery - results`, queryResults)

      // TODO remove artificial delay used only to develop "in progress" updates
      await delay(200)

      // first query completed normally
      running.status = "completed"
      running.updatedAt = new Date()
      running.rowsModified = await connection.getRowsModified()
      running.columns = queryResults?.[0]?.columns
      running.values = queryResults?.[0]?.values
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
    notifyChanges()
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
        notifyChanges()
        break

      case "toggleResults":
        setVariant(variant == "bottom" ? "right" : "bottom")
        return

      case "changeConnection":
        query.connectionId = command.args?.item?.id
        notifyChanges()
        return

      case "changeTitle":
        query.title = command.args?.item
        notifyChanges()
        return
    }
  }

  //
  // render
  //

  function renderHeader() {
    const connectionVariant = isMediumScreen ? "default" : "compact"
    return (
      <Box className="QueryPanel-header">
        <Stack direction="row" spacing={1} sx={{ width: 1 }}>
          <TitleField className="QueryPanel-title" value={props.query?.title} onCommand={handleCommand} />
          <ConnectionPicker
            connection={connection}
            connections={props.connections}
            onCommand={handleCommand}
            variant={connectionVariant}
          />
          <Box>
            <Button className="QueryPanel-run" variant="outlined" onClick={runQuery} startIcon={<Icon>play</Icon>}>
              Run
            </Button>
          </Box>
        </Stack>
        {renderCommands()}
      </Box>
    )
  }

  function renderCommands() {
    // TODO show a user's avatar or list of users which share this query instead of plain info icon
    return (
      <Stack className="QueryPanel-commands" direction="row">
        <IconButton command={{ command: "info", icon: "info", title: "Details" }} size="small" />
        <IconButton command={{ command: "bookmark", icon: "bookmark", title: "Bookmark" }} size="small" />
        <IconButton
          command={{ command: "history", icon: "history", title: "History" }}
          size="small"
          sx={{ marginRight: 2 }}
        />
        <IconButton
          command={{ command: "prettify", icon: "prettify", title: "Prettify" }}
          size="small"
          sx={{ marginRight: 2 }}
        />
        <IconButton command={{ command: "comment", icon: "comment", title: "Comments" }} size="small" />
        <IconButton command={{ command: "share", icon: "share", title: "Share" }} size="small" />
      </Stack>
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
        const runConnection = props.connections.find((conn) => conn.id == run.query.connectionId)
        return <QueryRunPanel key={run.id} id={run.id} title={run.title} run={runClone} connection={runConnection} />
      })
      return (
        <Tabs tabId={runId} tabs={tabs} tabsCommands={isMediumScreen && [toggleResults]} onCommand={handleCommand} variant="above" />
      )
    }

    return (
      <Empty
        icon="table"
        title="No results yet"
        description="The results of your query will appear here"
        variant="fancy"
      />
    )
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
    if (variant == "bottom" || !isMediumScreen) {
      return (
        <Allotment
          className="QueryPanel-bottomResults"
          vertical={true}
          proportionalLayout={true}
          defaultSizes={[100, 400]}
        >
          <Allotment.Pane minSize={120}>
            <Box className="QueryPanel-editorBox">
              <Card className="QueryPanel-card" variant="outlined">
                {renderEditor()}
              </Card>
            </Box>
          </Allotment.Pane>
          <Allotment.Pane>
            <Box className="QueryPanel-resultsBox">
              <Card className="QueryPanel-card" variant="outlined">
                {renderRuns()}
              </Card>
            </Box>
          </Allotment.Pane>
        </Allotment>
      )
    } else {
      return (
        <Box sx={{ width: 1, height: 1 }}>
          <Allotment className="QueryPanel-rightResults" proportionalLayout={true} defaultSizes={[100, 200]}>
            <Allotment.Pane minSize={240}>
              <Box className="QueryPanel-editorBox">
                <Card className="QueryPanel-card" variant="outlined">
                  {renderEditor()}
                </Card>
              </Box>
            </Allotment.Pane>
            <Allotment.Pane>
              <Box className="QueryPanel-resultsBox">
                <Card className="QueryPanel-card" variant="outlined">
                  {renderRuns()}
                </Card>
              </Box>
            </Allotment.Pane>
          </Allotment>
        </Box>
      )
    }
  }

  return (
    <Box className="QueryPanel-root" sx={QueryPanel_SxProps}>
      {renderHeader()}
      <Box sx={{ width: 1, flexGrow: 1 }}>{renderAlloment()}</Box>
    </Box>
  )
}
