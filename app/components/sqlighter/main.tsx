//
// app.tsx - sqlighter as a full page application
//

// libs
import React, { useState, useEffect, ReactElement } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

// model
import { Command } from "../../lib/commands"
import { DataConnection } from "../../lib/data/connections"
import { DataConnectionFactory } from "../../lib/data/factory"
import { Query } from "../../lib/items/query"

// components
import { DatabaseActivity } from "../activities/databaseactivity"
import { HistoryActivity } from "../activities/historyactivity"
import { BookmarksActivity } from "../activities/bookmarksactivity"
import { DatabasePanel } from "../panels/databasepanel"
import { Empty } from "../ui/empty"
import { HomePanel, HOME_PANEL_ID } from "../panels/homepanel"
import { Panel, PanelElement, PanelProps } from "../navigation/panel"
import { TablePanel } from "../panels/tablepanel"
import { QueryPanel } from "../panels/querypanel"
import { TabsLayout } from "../navigation/tabslayout"
import { useSqljs } from "../hooks/usedb"

export interface MainProps extends PanelProps {
  /** User currently signedin (if any) */
  user?: object
}

/** Main component for SQLighter app which includes activities, sidebar, tabs, etc... */
export default function Main(props: MainProps) {
  //
  // state
  //

  // TODO persist currently selected activity in user preferences
  const [activityId, setActivityId] = useState<string>("act_database")

  // currently selected tabId
  const [tabId, setTabId] = useState<string>(HOME_PANEL_ID)
  // list of data models for tabs (actual tabs are rendered on demand)
  const [tabs, setTabs] = useState<{ id: string; component: string; props?: any }[]>([
    { id: HOME_PANEL_ID, component: "HomePanel" },
  ])

  // selected connection
  const [connection, setConnection] = useState<DataConnection>(null)
  // all connections
  const [connections, setConnections] = useState<DataConnection[]>(null)

  // history of query runs
  const [history, setHistory] = useState<Query[]>([])

  //
  // temporary code while we work out the connection setup panels, etc
  //

  const sqljs = useSqljs()
  useEffect(() => {
    if (sqljs) {
      console.log("DatabasePanel - has sqljs")
    }
  }, [sqljs])
  /*
  async function getDatabaseConnection(url, title) {
    if (sqljs) {
      const connection = DataConnectionFactory.create({ client: "sqlite3", title, connection: { url } })
      await connection.connect(sqljs)
      console.debug(`getDatabaseConnection - ${url} opened`, connection)
      return connection
    }
  }
*/

  //
  // actions
  //

  /**
   * Open a file based database connection from a provided File or FileSystemFileHandle
   * that points to a SQLite database file. If the file parameter is not provided, prompt
   * the user to select a local file that should be opened. If the connection is opened
   * succesfully it added to list of current connections and selected.
   */
  async function openFile(file?: File | FileSystemFileHandle): Promise<DataConnection> {
    try {
      if (!file) {
        // let user pick a database file to open
        const pickerOpts = {
          types: [{ description: "SQLite", accept: { "application/*": [".db", ".sqlite"] } }],
          excludeAcceptAllOption: true,
          multiple: false,
        }

        try {
          // TODO need to use regular file input for for Firefox and other browsers
          // https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker
          file = (await (window as any).showOpenFilePicker(pickerOpts))[0]
        } catch (exception) {
          console.warn(`Main.openFile - user cancelled open file picker`, exception)
          return
        }
      }

      // TODO will recognize .csv files and parse them separately maybe with special connection?

      const config = { client: "sqlite3", connection: { file } }
      const connection = DataConnectionFactory.create(config)
      await connection.connect(sqljs)

      setConnection(connection)
      setConnections([connection, ...(connections || [])])
      return connection
    } catch (exception) {
      // TODO show toast with error explanation
      console.error(`Main.openFile - ${exception}`, exception)
      throw exception
    }
  }

  /** Will open a connection, if needed, then make it the current connection */
  async function openConnection(connection: DataConnection) {
    if (connection) {
      if (!connection.isConnected) {
        await connection.connect(sqljs)
      }
      const hasConnection = connections && connections.find((conn) => conn.id == connection.id)
      if (!hasConnection) {
        setConnections([connection, ...(connections || [])])
      }
      setConnection(connection)
    }
  }

  /** Opens a database tab to show this database structure or selects it if already open */
  function openDatabase(command: Command) {
    console.assert(command.args.connection)
    const args = { ...command.args }
    const tabId = `pnl_database_${connection.id}`
    const tab = tabs.find((tab) => tab.id == tabId)

    if (tab) {
      // existing tabs? refresh properties including selection
      tab.props = { title: tab.props.title, ...args }
      setTabs([...tabs])
    } else {
      const databaseTab = { id: tabId, component: "DatabasePanel", props: args }
      setTabs([databaseTab, ...tabs])
    }

    if (!tabs.find((tab) => tab.id === tabId)) {
    }
    setTabId(tabId)
  }

  /** Add <TablePanel> tab for the table indicated in the command, or selects existing panel if already open. */
  function openTable(command: Command) {
    // console.debug(`Main.openTable`, command)
    const args = { ...command.args }
    if (args.view) {
      args.table = args.view
      args.variant = "view"
      delete args.view
    } else {
      args.variant = "table"
    }

    const tabId = `pnl_table_${connection.id}_${args.database}_${args.table}`
    const tab = tabs.find((tab) => tab.id === tabId)
    if (tab) {
      // existing tabs? refresh properties including selection
      tab.props = { title: tab.props.title, ...args }
      setTabs([...tabs])
    } else {
      // new tab
      const tableTab = {
        id: tabId,
        component: "TablePanel",
        props: { ...args, title: command.args.table || command.args.view },
      }
      setTabs([tableTab, ...tabs])
    }
    // select tab if needed
    setTabId(tabId)
  }

  //
  // handlers
  //

  /** A query was executed or somehow modified. Update history, potentially refresh tab names, bookmarks, etc */
  function handleChangedQuery(command: Command) {
    const query = command.args?.query as Query
    if (query) {
      // refresh tab titles if needed
      setTabs([...tabs])

      // add to history then see if there's an older version we can get rid of
      const lastRun = query.runs?.[0]
      if (lastRun?.status == "completed") {
        // keep only last run, do not retain actual results
        const { values, columns, ...runClone } = query.runs[0]
        const queryClone = { ...query } // duplicate query
        queryClone.runs = [runClone] // keep only last run
        let updatedHistory = [queryClone, ...history]

        const prevQuery = history.find((q) => q.id == query.id)
        if (prevQuery) {
          const prevRun = prevQuery.runs?.[0]
          if (lastRun.sql == prevRun?.sql) {
            // same sql, remove to avoid too many duplicates
            updatedHistory = updatedHistory.filter((q) => q != prevQuery)
          }
        }

        // track query + run in history
        setHistory(updatedHistory)
      }
    }
  }

  /** Delete queries from history */
  function handleDeleteQueries(queries: Query[]) {
    // delete the very same object as a query with the same id may appear multiple times in history
    setHistory(history.filter((query) => !queries.find((q) => q === query)))
  }

  async function handleCommand(event: React.SyntheticEvent, command: Command) {
    console.debug(`Main.handleCommand - ${command.command}`, command)
    switch (command.command) {
      case "openHome":
        // add home panel if not opened yet, select tab
        if (!tabs.find((tab) => tab.id === HOME_PANEL_ID)) {
          const homeTab = { id: HOME_PANEL_ID, component: "HomePanel" }
          setTabs([homeTab, ...tabs])
        }
        setTabId(HOME_PANEL_ID)
        break

      case "openFile":
        await openFile(command.args?.file)
        return

      case "openConnection":
        if (command.args?.connection) {
          await openConnection(command.args.connection)
        }
        return

      case "openDatabase":
        openDatabase(command)
        return

      case "openTable":
        openTable(command)
        return

      // open a new tab with a query panel
      case "openQuery":
      case "tabs.newTab":
        const query = new Query()
        query.connectionId = connection?.id
        query.sql = command.args?.sql // newTab doesn't have a query
        if (command.args?.title) {
          query.title = command.args.title
        }
        const tab = { id: query.id, component: "QueryPanel", props: { query } }
        setTabs([tab, ...tabs])
        setTabId(query.id)
        break

      // tabs rearranged, opened, closed, etc
      case "changedTabs":
        const changedTabs = command.args.tabs.map((tabElement: ReactElement) =>
          tabs.find((tab) => tabElement.key == tab.id)
        )
        setTabId(command.args.id)
        setTabs(changedTabs)
        return

      case "changedActivity":
        setActivityId(command.args.id)
        return

      case "changedConnection":
        setConnection(command.args.item)
        break

      // data model for query has changed, update history, force tabs redraw
      case "changedQuery":
        handleChangedQuery(command)
        return

      case "deleteQuery":
        handleDeleteQueries([command.args as Query])
        return

      case "deleteQueries":
        handleDeleteQueries(command.args as Query[])
        return

      // receive files from drag and drop
      case "dropItems":
        if (command.args.files) {
          for (const file of command.args.files) {
            await openFile(file)
          }
        }
        return
    }

    // pass to parent?
    if (props.onCommand) {
      props.onCommand(event, command)
    }
  }

  //
  // rendering
  //

  function renderActivities(): PanelElement[] {
    return [
      <DatabaseActivity
        id="act_database"
        title="Database"
        icon="database"
        connection={connection}
        connections={connections}
        onCommand={handleCommand}
      />,
      <BookmarksActivity
        id="act_bookmarks"
        title="Bookmarks"
        icon="bookmark"
        queries={props.user && history}
        onCommand={handleCommand}
      />,
      <HistoryActivity id="act_history" title="History" icon="history" queries={history} onCommand={handleCommand} />,
    ]
  }

  function renderTabs() {
    return tabs.map((tab) => {
      switch (tab.component) {
        case "HomePanel":
          return (
            <HomePanel
              key={HOME_PANEL_ID}
              id={HOME_PANEL_ID}
              title="Home"
              icon="home"
              connection={connection}
              connections={connections}
              onCommand={handleCommand}
            />
          )
        case "DatabasePanel":
          return (
            <DatabasePanel
              key={tab.id}
              id={tab.id}
              title={tab.props.connection.title}
              icon="database"
              connection={tab.props.connection}
              selection={tab.props.selection}
              onCommand={handleCommand}
            />
          )
        case "TablePanel":
          return (
            <TablePanel
              key={tab.id}
              id={tab.id}
              title={tab.props.title}
              icon="table"
              {...tab.props}
              onCommand={handleCommand}
            />
          )
        case "QueryPanel":
          const query = tab.props.query
          return (
            <QueryPanel
              key={tab.id}
              id={query.id}
              title={query.title}
              icon="code"
              connections={connections}
              query={query}
              onCommand={handleCommand}
            />
          )
      }
    })
  }

  function renderEmpty() {
    if (!connections) {
      return (
        <Empty icon="fileOpen" title="Open a database file to get started" description="or drag and drop it here">
          <Button variant="outlined" sx={{ mt: 2 }} onClick={(e) => openFile()}>
            Open File
          </Button>
        </Empty>
      )
    }
    return null
  }

  return (
    <TabsLayout
      title="SQLighter"
      description="Lighter, mightier"
      activityId={activityId}
      activities={renderActivities()}
      tabId={tabId}
      tabs={tabs ? renderTabs() : []}
      tabsCommands={[
        {
          command: "tabs.newTab",
          title: "New Query",
          icon: "add",
        },
      ]}
      empty={renderEmpty()}
      user={props.user}
      onCommand={handleCommand}
    />
  )
}
