//
// Sqlighter.tsx - sqlighter as a full page application
//

// libs
import React, { useState, useEffect, ReactElement } from "react"
import Button from "@mui/material/Button"

// model
import { Command } from "../lib/commands"
import { DataConnection } from "../lib/data/connections"
import { DataConnectionFactory } from "../lib/data/factory"
import { Query, QueryRun } from "../lib/items/query"

// hooks
import { useSqljs } from "./hooks/usedb"
import { useBookmarks } from "./hooks/usebookmarks"
import { User } from "../lib/items/users"

// components
import { DatabaseActivity } from "./activities/databaseactivity"
import { HistoryActivity } from "./activities/historyactivity"
import { BookmarksActivity, BOOKMARKS_FOLDER } from "./activities/bookmarksactivity"
import { DatabasePanel } from "./panels/databasepanel"
import { Empty } from "./ui/empty"
import { HomePanel, HOME_PANEL_ID } from "./panels/homepanel"
import { PanelElement, PanelProps } from "./navigation/panel"
import { TablePanel } from "./panels/tablepanel"
import { QueryPanel } from "./panels/querypanel"
import { TabsLayout } from "./navigation/tabslayout"
import { getStream } from "../lib/client"

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

/** Data model for opened tabs */
type TabModel = { id: string; component: "home" | "database" | "table" | "query"; args?: any }

export interface SqlighterProps extends PanelProps {
  /** User currently signedin (if any) */
  user?: User
}

/** Main component for SQLighter app which includes activities, sidebar, tabs, etc... */
export default function Sqlighter(props: SqlighterProps) {
  //
  // state
  //

  // TODO persist currently selected activity in user preferences
  const [activityId, setActivityId] = useState<string>("act_database")

  // currently selected tabId
  const [tabId, setTabId] = useState<string>(HOME_PANEL_ID)
  // list of data models for tabs (actual tabs are rendered on demand)
  const [tabs, setTabs] = useState<TabModel[]>([{ id: HOME_PANEL_ID, component: "home" }])

  // selected connection
  const [connection, setConnection] = useState<DataConnection>(null)
  // all connections
  const [connections, setConnections] = useState<DataConnection[]>(null)

  // history of query runs
  const [history, setHistory] = useState<Query[]>([])

  // cloud stored bookmarks
  const { bookmarks, setBookmarks } = useBookmarks(props.user)

  //
  // temporary code while we work out the connection setup panels, etc
  //

  const sqljs = useSqljs()
  useEffect(() => {
    if (sqljs) {
      console.log("Sqlighter - has sqljs")
    }
  }, [sqljs])

  //
  // actions
  //

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
      openDatabase(connection)
    }
  }

  /** Opens a database tab to show this database structure or selects it if already open */
  function openDatabase(connection: DataConnection, database?: string, selection?: string) {
    console.assert(connection)
    const tabId = `pnl_database_${connection.id}`
    const tab = tabs.find((tab) => tab.id == tabId)

    if (tab) {
      // existing tabs? refresh properties including selection
      tab.args = { title: tab.args.title, connection, database, selection }
      setTabs([...tabs])
    } else {
      const databaseTab: TabModel = { id: tabId, component: "database", args: { connection, database, selection } }
      setTabs([databaseTab, ...tabs])
    }

    if (!tabs.find((tab) => tab.id === tabId)) {
    }
    setTabId(tabId)
  }

  /**
   * Open a file based database connection from a provided File or FileSystemFileHandle
   * that points to a SQLite database file. If the file parameter is not provided, prompt
   * the user to select a local file that should be opened. If the connection is opened
   * succesfully it added to list of current connections and selected.
   */
  async function openFile(file?: File | FileSystemFileHandle): Promise<DataConnection> {
    console.debug(`Sqlighter.openFile`, file)
    try {
      if (!file) {
        // let user pick a database file to open
        const pickerOpts = {
          types: [{ description: "SQLite", accept: { "application/*": [".db", ".sqlite", ".csv"] } }],
          excludeAcceptAllOption: true,
          multiple: false,
        }

        try {
          // TODO need to use regular file input for for Firefox and other browsers
          // https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker
          file = (await (window as any).showOpenFilePicker(pickerOpts))[0]
        } catch (exception) {
          console.warn(`Sqlighter.openFile - user cancelled open file picker`, exception)
          return
        }
      }

      let connection = null

      if (file.name.toLowerCase().endsWith(".db") || file.name.toLowerCase().endsWith(".sqlite")) {
        const config = { client: "sqlite3", connection: { file } }
        connection = DataConnectionFactory.create(config)
        await connection.connect(sqljs)
      } else {
        // see if we can import this file istead
        const config = { client: "sqlite3", title: file.name, connection: {} }
        connection = DataConnectionFactory.create(config)
        await connection.connect(sqljs)

        const fromFormat = file.name.split(".").pop().toLowerCase()
        if (connection.canImport(fromFormat)) {
          if (file instanceof FileSystemFileHandle) {
            file = await file.getFile()
          }
          await connection.import(fromFormat, file)
        } else {
          throw new Error(`Sqlighter.openFile - file type not supported`)
        }
      }

      setConnection(connection)
      setConnections([connection, ...(connections || [])])
      openDatabase(connection)

      return connection
    } catch (exception) {
      // TODO show toast with error explanation
      console.error(`Sqlighter.openFile - ${exception}`, exception)
      throw exception
    }
  }

  function openCsv(file?: File | FileSystemFileHandle): Promise<DataConnection> {
    return null
  }

  /** Add home panel if not opened yet, select tab */
  function openHome() {
    if (!tabs.find((tab) => tab.id === HOME_PANEL_ID)) {
      const homeTab: TabModel = { id: HOME_PANEL_ID, component: "home" }
      setTabs([homeTab, ...tabs])
    }
    setTabId(HOME_PANEL_ID)
  }

  /** Add <TablePanel> tab for the table indicated in the command, or selects existing panel if already open. */
  function openTable(command: Command) {
    // console.debug(`Sqlighter.openTable`, command)
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
      tab.args = { title: tab.args.title, ...args }
      setTabs([...tabs])
    } else {
      // new tab
      const tableTab: TabModel = {
        id: tabId,
        component: "table",
        args: { ...args, title: command.args.table || command.args.view },
      }
      setTabs([tableTab, ...tabs])
    }
    // select tab if needed
    setTabId(tabId)
  }

  //
  // queries
  //

  function openQuery(query?: Query) {
    console.debug(`Sqlighter.openQuery`, query)
    query = Object.assign(new Query(), query)
    if (!query.connectionId) {
      query.connectionId = connection?.id
    }
    if (!query.sql) {
      // TODO we could find a query that is a little bit less stupid, for example select the first table in the schema
      query.sql = "select 1"
    }

    let tab = tabs.find((tab) => tab.id === query.id)
    if (tab) {
      // we already have an open tab for this query? just update sql
      const tabQuery = { ...tab.args.query, sql: query.sql }
      changeQuery(tabQuery)
      setTabs([...tabs])
    } else {
      // if there is already a tab with the proposed name, add suffix (1, 2, 3, etc)
      let titleIndex = 1
      let title = query.title
      while (tabs.find((tab) => tab.args?.query?.title === title)) {
        title = `${query.title} (${titleIndex})`
        titleIndex++
      }

      // create a new tab for this query
      tab = { id: query.id, component: "query", args: { query: { ...query, title } } }
      setTabs([tab, ...tabs])
    }
    setTabId(query.id)
  }

  /** Run query and produce results in one or more QueryRun objects */
  async function runQuery(query: Query, connection: DataConnection) {
    console.assert(query)
    console.assert(connection)
    console.debug(`Sqlighter.runQuery - ${query.id}, ${query.sql}`, query)

    // create a tab that is shown while the query is being executed to display progress, etc.
    const running = new QueryRun()
    running.parentId = query.id
    running.query = query
    running.status = "running"
    running.sql = query.sql

    // add run, update query watchers
    query = { ...query }
    query.runId = running.id
    query.runs = query.runs ? [running, ...query.runs] : [running]
    changeQuery(query)

    try {
      // TODO split sql into separate statements and run each query separately in sequence to provide correct stats
      // see https://sql.js.org/documentation/Database.html#%5B%22iterateStatements%22%5D
      query = { ...query }
      const queryResults = await connection.getResults(query.sql)

      // TODO remove artificial delay used only to develop "in progress" updates
      await delay(200)

      // first query completed normally
      // TODO replace running, do not modify object
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
    changeQuery(query)
  }

  /** A query was executed or somehow modified. Update tabs, history, bookmarks... */
  function changeQuery(query: Query) {
    console.assert(query)
    console.debug(`Sqlighter.changeQuery - ${query.id}`, query)

    // refresh query tab if found
    for (const tab of tabs) {
      if (tab.component === "query" && tab.args?.query?.id === query.id) {
        tab.args.query = query
        setTabs([...tabs])
      }
    }

    // refresh history
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

    // refresh bookmarks
    let updatedBookmarks = bookmarks
    const queryBookmark = bookmarks && bookmarks.find((b) => b.id == query.id)
    if (queryBookmark) {
      // if this is an existing bookmarked query that has changed we remove
      // and it will be replaced by the updated version of itself. if this is
      // a query that used to be a bookmark but is no longer, we remove it.
      updatedBookmarks = bookmarks.filter((b) => b.id != query.id)
    }
    if (query.folder) {
      // we don't save query runs, just the query itself
      const { runs, ...bookmark } = query
      updatedBookmarks = updatedBookmarks ? [bookmark, ...updatedBookmarks] : [bookmark]
    }
    if (bookmarks != updatedBookmarks) {
      setBookmarks(updatedBookmarks)
    }
  }

  /** Delete queries from history */
  function deleteHistory(queries: Query[]) {
    // delete the very same object as a query with the same id may appear multiple times in history
    setHistory(history.filter((query) => !queries.find((q) => q === query)))
  }

  //
  // bookmarks
  //

  /** Add a query to bookmarks or remove from bookmarks */
  function bookmarkQuery(query: Query) {
    console.assert(query)
    query = { ...query }
    if (query.folder) {
      delete query.folder
    } else {
      query.folder = BOOKMARKS_FOLDER
    }
    changeQuery(query)
  }

  async function deleteBookmarks(queries: Query[]) {
    console.assert(queries)
    if (bookmarks) {
      const updatedBookmarks = bookmarks.filter((b1) => !queries.find((b2) => b1.id == b2.id))
      await setBookmarks(updatedBookmarks)
    }
  }

  //
  // handlers
  //

  async function handleCommand(event: React.SyntheticEvent, command: Command) {
    console.debug(`Sqlighter.handleCommand - ${command.command}`, command)
    console.assert(props.onCommand)

    switch (command.command) {
      case "bookmarkQuery":
        if (props.user) {
          bookmarkQuery(command.args.query)
        } else {
          props.onCommand(event, { command: "signin" })
        }
        return

      case "changeActivity":
        setActivityId(command.args.id)
        return

      case "changeConnection":
        setConnection(command.args.item)
        break

      case "changeQuery":
        changeQuery(command.args?.query)
        return

      case "changeTabs":
        // tabs rearranged, opened, closed, etc
        const changedTabs = command.args.tabs.map((tabElement: ReactElement) =>
          tabs.find((tab) => tabElement.key == tab.id)
        )
        setTabId(command.args.tabId)
        setTabs(changedTabs)
        return

      case "deleteBookmarks":
        await deleteBookmarks(command.args.queries as Query[])
        return

      case "deleteHistory":
        deleteHistory(command.args.queries as Query[])
        return

      case "dropItems":
        // receive files from drag and drop
        if (command.args.files) {
          for (const file of command.args.files) {
            await openFile(file)
          }
        }
        return

      case "openConnection":
        if (command.args?.connection) {
          await openConnection(command.args.connection)
        }
        return

      case "openDatabase":
        openDatabase(command.args.connection, command.args.database, command.args.selection)
        return

      case "openFile":
        await openFile(command.args?.file)
        return

      case "openHome":
        openHome()
        break

      case "openProfile":
        // for now just signout, later will show profile page
        props.onCommand(event, { command: "signout" })
        return

      case "openTable":
        openTable(command)
        return

      case "openQuery":
        openQuery(command.args as Query)
        return

      case "runQuery":
        await runQuery(command.args?.query, command.args?.connection)
        return
    }

    // pass to parent
    props.onCommand(event, command)
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
        queries={props.user ? bookmarks || [] : undefined} // empty state only for non-logged in users
        onCommand={handleCommand}
      />,
      <HistoryActivity id="act_history" title="History" icon="history" queries={history} onCommand={handleCommand} />,
    ]
  }

  function renderTabs() {
    return tabs.map((tab) => {
      switch (tab.component) {
        case "home":
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
        case "database":
          return (
            <DatabasePanel
              key={tab.id}
              id={tab.id}
              title={tab.args.connection.title}
              icon="database"
              connection={tab.args.connection}
              selection={tab.args.selection}
              onCommand={handleCommand}
            />
          )
        case "table":
          return (
            <TablePanel
              key={tab.id}
              id={tab.id}
              title={tab.args.title}
              icon="table"
              {...tab.args}
              onCommand={handleCommand}
            />
          )
        case "query":
          const query = tab.args.query
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
      title="sqlighter"
      description="lighter, faster"
      activityId={activityId}
      activities={renderActivities()}
      tabId={tabId}
      tabs={tabs ? renderTabs() : []}
      tabsCommands={[
        {
          command: "openQuery",
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
