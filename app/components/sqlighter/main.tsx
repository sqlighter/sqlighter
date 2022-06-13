//
// app.tsx - sqlighter as a full page application
//

import React, { useState, useEffect, ReactElement } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

import { Command } from "../../lib/commands"
import { useSqljs } from "../hooks/useDB"
import { DataConnection, DataConfig } from "../../lib/data/connections"
import { DataConnectionFactory } from "../../lib/data/factory"
import { SqliteDataConnection } from "../../lib/data/clients/sqlite"
import { QueryPanel } from "../panels/querypanel"
import { HomePanel, HOME_PANEL_ID } from "../panels/homepanel"
import { TabsLayout } from "../../components/navigation/tabslayout"
import { Panel, PanelElement, PanelProps } from "../../components/navigation/panel"
import { DatabasePanel } from "../database/databasepanel"
import { IconButton } from "../ui/iconbutton"
import { Query } from "../../lib/items/query"
import { compareAsc } from "date-fns"
import { Empty } from "../ui/empty"

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

  //
  // temporary code while we work out the connection setup panels, etc
  //

  const sqljs = useSqljs()
  useEffect(() => {
    if (sqljs) {
      console.log("DatabasePanel - has sqljs")
    }
  }, [sqljs])

  async function getDatabaseConnection(url, title) {
    if (sqljs) {
      const connection = DataConnectionFactory.create({ client: "sqlite3", title, connection: { url } })
      await connection.connect(sqljs)
      console.debug(`getDatabaseConnection - ${url} opened`, connection)
      return connection
    }
  }

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
    if (!connection.isConnected) {
 
 
      const db = new sqljs.Database();
      // NOTE: You can also use new SQL.Database(data) where
      // data is an Uint8Array representing an SQLite database file
      
      
      // Execute a single SQL string that contains multiple statements
      let sqlstr = "CREATE TABLE hello (a int, b char); \
      INSERT INTO hello VALUES (0, 'hello'); \
      INSERT INTO hello VALUES (1, 'world');";
      db.run(sqlstr); // Run the query without returning anything
      
      // Prepare an sql statement
      const stmt = db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");
      
      // Bind values to the parameters and fetch the results of the query
      const result = stmt.getAsObject({':aval' : 1, ':bval' : 'world'});
      console.log(result); // Will print {a:1, b:'world'}
      
 
 
 
 
 
 
 
 
 
      await connection.connect(sqljs)
    }
    const hasConnection = connections && connections.find((conn) => conn.id == connection.id)
    if (!hasConnection) {
      setConnections([connection, ...(connections || [])])
    }
    setConnection(connection)
  }

  //
  // activities
  //

  //
  // handlers
  //

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

      // open a new tab with a query panel
      case "sqlighter.viewStructure": // TODO will have its own panel but just open sql for now
      case "sqlighter.viewQuery":
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

      case "changeConnection":
        setConnection(command.args.item)
        break

      // data model for query has changed, force tabs redraw
      case "changeQuery":
        setTabs([...tabs])
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
      <DatabasePanel
        id="act_database"
        title="Database"
        icon="database"
        connection={connection}
        connections={connections}
        onCommand={handleCommand}
      />,
      <Panel id="act_bookmarks" title="Bookmarks" icon="bookmark">
        <Box p={1}>
          <Typography variant="overline">Bookmarks (tbd)</Typography>
        </Box>
      </Panel>,
      <Panel id="act_history" title="History" icon="history">
        <Box p={1}>
          <Typography variant="overline">History (tbd)</Typography>
        </Box>
      </Panel>,
    ]
  }

  function renderTabs() {
    return tabs.map((tab) => {
      console.debug(`renderTabs - tab`, tab)
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
