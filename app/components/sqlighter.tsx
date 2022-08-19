//
// Sqlighter.tsx - sqlighter as a full page application
//

// libs
import React, { useState, useEffect, ReactElement } from "react"
import { fileOpen, fileSave, FileWithHandle, FirstFileOpenOptions } from "browser-fs-access"

// model
import { Command } from "../lib/commands"
import { DataConnection, DataFormat } from "../lib/data/connections"
import { DataConnectionFactory } from "../lib/data/factory"
import { Query, QueryRun } from "../lib/items/query"
import { trackEvent } from "../lib/analytics"
import { getFilenameExtension, replaceFilenameExtension } from "../lib/client"

// hooks
import { useSqljs } from "./hooks/usedb"
import { useBookmarks } from "./hooks/usebookmarks"
import { User } from "../lib/items/users"

// components
import { DatabaseActivity } from "./activities/databaseactivity"
import { HistoryActivity } from "./activities/historyactivity"
import { BookmarksActivity, BOOKMARKS_FOLDER } from "./activities/bookmarksactivity"
import { DatabasePanel } from "./panels/databasepanel"
import { HomePanel, HOME_PANEL_ID } from "./panels/homepanel"
import { PanelElement, PanelProps } from "./navigation/panel"
import { TablePanel } from "./panels/tablepanel"
import { QueryPanel } from "./panels/querypanel"
import { TabsLayout } from "./navigation/tabslayout"
import { useForceUpdate } from "./hooks/useforceupdate"

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

  // force a refresh (eg. when models update)
  const forceUpdate = useForceUpdate()

  //
  // temporary code while we work out the connection setup panels, etc
  //

  const sqljs = useSqljs()
  useEffect(() => {
    if (sqljs) {
      console.log("Sqlighter - has sqljs")
    }
  }, [sqljs])

  useEffect(() => {
    if (sqljs) {
      console.log("Sqlighter - has sqljs")
    }
  }, [connection])

  //
  // actions
  //

  /** Will open a connection, if needed, then make it the current connection */
  async function openConnection(connection: DataConnection) {
    if (connection) {
      const startedOn = performance.now()
      if (!connection.isConnected) {
        await connection.connect(sqljs)
      }

      const hasConnection = connections && connections.find((conn) => conn.id == connection.id)
      if (!hasConnection) {
        setConnections([connection, ...(connections || [])])
      }
      setConnection(connection)
      openDatabase(connection)

      // track only anonymous, non identifiable data
      trackEvent("open_connection", {
        connection_client: connection.configs?.client, // type of databaase client
        connection_elapsed: performance.now() - startedOn, // time to connect
      })
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
    setTabId(tabId)

    // select database activity
    setActivityId("act_database")
  }

  /**
   * Open a file based database connection from a provided File or FileSystemFileHandle
   * that points to a SQLite database file. If the file parameter is not provided, prompt
   * the user to select a local file that should be opened. If the connection is opened
   * succesfully it added to list of current connections and selected.
   */
  async function openFile(fileOrHandle?: File | FileSystemFileHandle): Promise<DataConnection> {
    const startedOn = performance.now()

    try {
      let file = null
      let fileHandle = null

      if (fileOrHandle) {
        console.debug(`Sqlighter.openFile`, fileOrHandle)
        if (fileOrHandle instanceof File) {
          file = fileOrHandle as File
        } else {
          // we need to try/catch this check because not all browsers support FileSystemFileHandle
          try {
            if (fileOrHandle instanceof FileSystemFileHandle) {
              fileHandle = fileOrHandle
              file = await fileHandle.getFile()
            }
          } catch (exception) {
            // console.warn(`Sqlighter.openFile - FileSystemFileHandle not supported?`, exception)
          }
        }
      } else {
        try {
          // pick a file using the File System Access API where implemented, for example
          // in Chrome so we can get a fileHandle that can be used to write the file out later.
          // if the API is not implemented, fall back to standard HTML5 File API.
          const pickerOptions: FirstFileOpenOptions<boolean> = {
            description: "SQLite or .csv files",
            mimeTypes: ["application/*"],
            extensions: [".db", ".sqlite", ".csv"],
            multiple: false,
            startIn: "downloads", // suggest browser where to start
            id: "openFile", // user agent can remember different directories for different IDs
          }

          const fileWithHandle = (await fileOpen(pickerOptions)) as FileWithHandle // single file, not an array
          file = fileWithHandle
          fileHandle = fileWithHandle.handle
        } catch (exception) {
          // console.warn(`Sqlighter.openFile - user cancelled open file picker`, exception)
          return
        }
      }

      let connection = null
      const fileSize = file.size
      const fileExtension = getFilenameExtension(file.name)

      // track only anonymous, non identifiable data
      trackEvent("open_file", {
        file_extension: fileExtension,
        file_size: fileSize,
        file_elapsed: performance.now() - startedOn, // time to open file
      })

      if (fileExtension === "db" || fileExtension === "sqlite") {
        const config = { client: "sqlite3", connection: { file, fileHandle } }
        connection = DataConnectionFactory.create(config)
        await connection.connect(sqljs)

        setConnection(connection)
        setConnections([connection, ...(connections || [])])
        openDatabase(connection)
      } else {
        // see if we can import this file instead
        const title = replaceFilenameExtension(file.name, "db")
        const config = { client: "sqlite3", title, connection: {} }
        connection = DataConnectionFactory.create(config)
        await connection.connect(sqljs)

        if (connection.canImport(fileExtension)) {
          const importResult = await connection.import(fileExtension, file)
          setConnection(connection)
          setConnections([connection, ...(connections || [])])
          openTable({
            command: "openTable",
            args: {
              connection,
              database: importResult.database,
              table: importResult.table,
            },
          })
        } else {
          throw new Error(`Sqlighter.openFile - file type not supported`)
        }
      }

      return connection
    } catch (exception) {
      // TODO show toast with error explanation
      console.error(`Sqlighter.openFile - ${exception}`, exception)
      throw exception
    }
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
    // console.debug(`Sqlighter.openTable`, command, connection)
    const args = { ...command.args }
    if (args.view) {
      args.table = args.view
      args.variant = "view"
      delete args.view
    } else {
      args.variant = "table"
    }

    const tabId = `pnl_table_${args.connection.id}_${args.database}_${args.table}`
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

  /** Close given connection and related resources */
  async function closeConnection(closingConnection: DataConnection) {
    if (connections && connections.find((conn) => conn.id == closingConnection.id)) {
      await closingConnection.close()
      setConnections(connections.filter((conn) => conn.id != closingConnection.id))
      if (connection === closingConnection) {
        setConnection(null)
        // TODO close all tabs related to this connection
      }
    }
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
    const startedOn = performance.now()
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

      // first query completed normally
      // TODO replace running, do not modify object
      running.status = "completed"
      running.updatedAt = new Date().toISOString()
      running.rowsModified = await connection.getRowsModified()
      running.columns = queryResults?.[0]?.columns
      running.values = queryResults?.[0]?.values

      // track only anonymous, non identifiable data
      trackEvent("run_query", {
        query_results: queryResults?.length, // number of result sets
        query_columns: running.columns?.length,
        query_rows: running.values?.length,
        query_elapsed: performance.now() - startedOn,
      })

      if (queryResults.length > 1) {
        const baseTitle = running.title
        running.title += " (1)"

        for (let i = 1; i < queryResults.length; i++) {
          const additionalRun = new QueryRun()
          additionalRun.parentId = query.id
          additionalRun.query = running.query
          additionalRun.title = `${baseTitle} (${i + 1})`
          additionalRun.createdAt = running.createdAt
          additionalRun.updatedAt = new Date().toISOString()
          additionalRun.status = "completed"
          additionalRun.sql = running.sql
          additionalRun.columns = queryResults[i].columns
          additionalRun.values = queryResults[i].values

          // add tab to runs
          query.runs.splice(i, 0, additionalRun)

          // track only anonymous, non identifiable data
          trackEvent("run_query", {
            query_results: queryResults?.length, // number of result sets
            query_columns: additionalRun.columns?.length,
            query_rows: additionalRun.values?.length,
            query_elapsed: performance.now() - startedOn,
          })
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

    query.updatedAt = new Date().toISOString()
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

    // select bookmarks activity
    setActivityId("act_bookmarks")
  }

  async function deleteBookmarks(queries: Query[]) {
    console.assert(queries)
    if (bookmarks) {
      const updatedBookmarks = bookmarks.filter((b1) => !queries.find((b2) => b1.id == b2.id))
      await setBookmarks(updatedBookmarks)

      // select bookmarks activity
      setActivityId("act_bookmarks")
    }
  }

  //
  // export/saving
  //

  /**
   * Handles export of an entire database in native format, a specific table in a database
   * or the results of a sql query on a given connection. Data is converted and then user is
   * prompted to download as file.
   * @param format Format to export to
   * @param filename Filename (connection name will be used if not provided)
   * @param connection Connection to export from
   * @param database Database to export (if not provided, will export entire database)
   * @param table Table to export
   * @param sql Specific sql query to export (alternative to table)
   */
  async function exportData(
    format: DataFormat,
    filename: string,
    connection: DataConnection,
    database?: string,
    table?: string,
    sql?: string
  ) {
    if (connection.canExport(format, database, table, sql)) {
      // convert export results into a downloadable file blob
      const startedOn = performance.now()
      filename = filename || connection.title
      filename = replaceFilenameExtension(filename, format || "db")

      const results = await connection.export(format, database, table, sql)
      const blob = new File([results.data], filename, { type: results.type })
      console.debug(`Sqlighter.exportData - ${filename}`, blob)

      // track only anonymous, non identifiable data
      trackEvent("export", {
        export_client: connection.configs?.client, // type of data source
        export_format: format,
        export_table: Boolean(table), // export of entire table?
        export_sql: Boolean(sql), // export of specific query?
        export_size: blob.size,
        export_elapsed: performance.now() - startedOn,
      })

      // create downloadable link and click on it to initiate download
      var link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = filename
      link.click()
    } else {
      console.warn(`Sqlighter.exportData - ${format} not supported`)
    }
  }

  /**
   * Save SQLite database directly to the user's computer as a file.
   * @param connection Connection to save to file
   */
  async function saveFile(connection: DataConnection) {
    const fileHandle = connection.configs.connection.fileHandle
    const fileName = connection.configs?.connection?.filename

    if (!connection.canExport() || !fileHandle) {
      console.warn(`Sqlighter.saveFile - not supported`, connection)
    }

    const startedOn = performance.now()

    // save entire database to blob
    const results = await connection.export()
    const blob = new File([results.data], fileName, { type: results.type })

    try {
      await fileSave(
        blob,
        {
          fileName,
          description: "SQLite file",
          extensions: [".db"],
        },
        fileHandle || null
      )
    } catch (exception) {
      console.error(`Sqlighter.saveFile - saving failed`, exception, connection)
    }

    // track only anonymous, non identifiable data
    trackEvent("save", {
      export_client: connection.configs?.client, // type of data source
      export_size: blob.size,
      export_elapsed: performance.now() - startedOn,
    })

    // TODO show completion toast?
  }

  //
  // handlers
  //

  async function handleCommand(event: React.SyntheticEvent, command: Command) {
    console.debug(`Sqlighter.handleCommand - ${command.command}`, command)
    console.assert(props.onCommand)

    const args = command.args || {}
    switch (command.command) {
      case "bookmarkQuery":
        if (props.user) {
          bookmarkQuery(command.args.query)
        } else {
          props.onCommand(event, { command: "signin" })
        }
        return

      case "changeActivity":
        setActivityId(args.id)
        return

      case "changeConnection":
        // force a refresh after the data model for a connection has changed
        // for example because we updated the connection title in DatabasePanel
        forceUpdate()
        return

      case "changeQuery":
        changeQuery(args.query)
        return

      case "changeTabs":
        // tabs rearranged, opened, closed, etc
        const changedTabs = args.tabs.map((tabElement: ReactElement) => tabs.find((tab) => tabElement.key == tab.id))
        setTabId(args.tabId)
        setTabs(changedTabs)
        return

      case "closeConnection":
        await closeConnection(args.connection)
        return

      case "deleteBookmarks":
        await deleteBookmarks(args.queries as Query[])
        return

      case "deleteHistory":
        deleteHistory(args.queries as Query[])
        return

      case "dropItems":
        // receive files from drag and drop
        if (command.args.files) {
          for (const file of command.args.files) {
            await openFile(file)
          }
        }
        return

      case "export":
        await exportData(args.format, args.filename, args.connection, args.database, args.table, args.sql)
        return

      case "openConnection":
        if (args.connection) {
          await openConnection(args.connection)
        }
        return

      case "openDatabase":
        openDatabase(args.connection, args.database, args.selection)
        return

      case "openFile":
        await openFile(args.file)
        return

      case "openHistory":
        setActivityId("act_history")
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
        await runQuery(args.query, args.connection)
        return

      case "setConnection":
        setConnection(args.connection)
        return

      case "save":
        await saveFile(args.connection)
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
          // retrieve connection used by the query (or use first available one)
          const query = tab.args.query
          const queryConnection = connections?.find((c) => c.id == query.connectionId)
          if (!queryConnection && connections?.length > 0) {
            changeQuery({ ...query, connectionId: connections[0].id })
          }
          return (
            <QueryPanel
              key={tab.id}
              id={query.id}
              title={query.title}
              icon="code"
              connection={queryConnection}
              connections={connections}
              query={query}
              onCommand={handleCommand}
            />
          )
      }
    })
  }

  return (
    <TabsLayout
      title="SQLighter"
      description="Lighter, faster"
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
      user={props.user}
      onCommand={handleCommand}
    />
  )
}
