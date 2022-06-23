//
// querypanel.tsx - panel used to edit and run database queries, show results
//

// libs
import React from "react"
import { useState, useRef } from "react"
import { Theme, SxProps } from "@mui/material"
import { Allotment } from "allotment"
import { format } from "sql-formatter"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import Stack from "@mui/material/Stack"
import useMediaQuery from "@mui/material/useMediaQuery"

// model
import { Command } from "../../lib/commands"
import { DataConnection } from "../../lib/data/connections"
import Query, { QueryRun } from "../../lib/items/query"

// components
import { Icon } from "../ui/icon"
import { IconButtonGroup } from "../ui/iconbuttongroup"
import { PanelProps } from "../navigation/panel"
import { Tabs } from "../navigation/tabs"
import { ConnectionPicker } from "../database/connectionpicker"
import { SqlEditor } from "../editor/sqleditor"
import { QueryRunPanel } from "../database/queryrunpanel"
import { useForceUpdate } from "../hooks/useforceupdate"
import { TitleField } from "../ui/titlefield"
import { Empty } from "../ui/empty"

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

// styles applied to main and subcomponents
const QueryPanel_SxProps: SxProps<Theme> = {
  width: 1,
  minWidth: 360,
  height: 1,
  maxHeight: 1,

  paddingTop: 1.5,
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
    //height: 36,
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

  /** Monaco editor used for SQL */
  const monacoRef = useRef(null)

  // used to force a refresh when data model changes
  const forceUpdate = useForceUpdate()
  function notifyChanges() {
    forceUpdate()
    if (props.onCommand) {
      props.onCommand(null, {
        command: "changedQuery",
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
    query.runs = query.runs ? [running, ...query.runs] : [running]
    setRunId(running.id)
    notifyChanges()

    try {
      // TODO split sql into separate statements and run each query separately in sequence to provide correct stats
      // see https://sql.js.org/documentation/Database.html#%5B%22iterateStatements%22%5D
      const queryResults = await connection.getResults(query.sql)

      // TODO remove artificial delay used only to develop "in progress" updates
      await delay(200)

      // first query completed normally
      running.status = "completed"
      running.updatedAt = new Date()
      running.rowsModified = await connection.getRowsModified()
      running.columns = queryResults?.[0]?.columns
      running.values = queryResults?.[0]?.values
      // console.debug(`QueryPanel.runQuery - completed`, running)

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

  /** Store reference to monaco's editor when it mounts */
  function handleEditorDidMount(editor, monaco) {
    monacoRef.current = editor
  }

  async function handleCommand(e: React.SyntheticEvent, command: Command) {
    console.debug(`QueryPanel.handleCommand - ${command.command}`, command)
    switch (command.command) {
      case "editor.changeValue":
        query.sql = command.args.value
        // does NOT need a forceUpdate since the editor's model is not controlled
        break

      // extract data models from views, update query, notify viewers
      case "changedTabs":
        query.runs = command.args.tabs.map((tab) => tab.props.run)
        setRunId(command.args.id)
        notifyChanges()
        break

      case "toggleResults":
        setVariant(variant == "bottom" ? "right" : "bottom")
        return

      case "changedConnection":
        query.connectionId = command.args?.item?.id
        notifyChanges()
        return

      case "changeTitle":
        query.title = command.args?.item
        notifyChanges()
        return

      case "prettify":
        if (monacoRef.current && props.query.sql) {
          // format and update data model
          props.query.sql = format(props.query.sql, { language: "sqlite", keywordCase: "upper" })
          monacoRef.current.getModel()?.setValue(props.query.sql)
          notifyChanges()
        }
        return
    }
  }

  //
  // render
  //

  function renderHeader() {
    // TODO run label could change automatically to: run, run selection, run all based on editor selection
    return (
      <Box className="QueryPanel-header">
        <Stack direction="row" spacing={1} sx={{ width: 1 }}>
          <TitleField className="QueryPanel-title" value={props.query?.title} onCommand={handleCommand} />
          <ConnectionPicker
            connection={connection}
            connections={props.connections}
            onCommand={handleCommand}
            variant="compact"
            // buttonVariant="outlined"
            buttonProps={{ sx: { width: 60 } }}
          >
            <Button className="QueryPanel-run" onClick={runQuery} startIcon={<Icon>play</Icon>}>
              Run
            </Button>
          </ConnectionPicker>
        </Stack>
        {renderCommands()}
      </Box>
    )
  }

  /** Commands shown below query title */
  function renderCommands() {
    const commands: (Command | "spacing")[] = [
      { command: "info", icon: "info", title: "Details" },
      { command: "bookmark", icon: "bookmark", title: "Bookmark" },
      { command: "history", icon: "history", title: "History" },
      "spacing",
      { command: "prettify", icon: "autofix", title: "Prettify" },
      "spacing",
      { command: "comment", icon: "comment", title: "Comments" },
      { command: "share", icon: "share", title: "Share" },
    ]

    // TODO show a user's avatar or list of users which share this query instead of plain info icon
    return <IconButtonGroup commands={commands} size="small" onCommand={handleCommand} />
  }

  function renderEditor() {
    return <SqlEditor value={query.sql} onCommand={handleCommand} onMount={handleEditorDidMount} />
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
        return (
          <QueryRunPanel
            key={run.id}
            id={run.id}
            title={run.title}
            icon="run"
            run={runClone}
            connection={runConnection}
          />
        )
      })
      return (
        <Tabs
          tabId={runId}
          tabs={tabs}
          tabsCommands={isMediumScreen && [toggleResults]}
          onCommand={handleCommand}
          variant="above"
          canClose
        />
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
              <Card className="QueryPanel-card" variant="outlined" square={true}>
                {renderEditor()}
              </Card>
            </Box>
          </Allotment.Pane>
          <Allotment.Pane>
            <Box className="QueryPanel-resultsBox">
              <Card className="QueryPanel-card" variant="outlined" square={true}>
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
                <Card className="QueryPanel-card" variant="outlined" square={true}>
                  {renderEditor()}
                </Card>
              </Box>
            </Allotment.Pane>
            <Allotment.Pane>
              <Box className="QueryPanel-resultsBox">
                <Card className="QueryPanel-card" variant="outlined" square={true}>
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
