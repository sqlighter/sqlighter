//
// app.tsx - sqlighter as a full page application
//

import React, { useState, useEffect, ReactElement } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { Command } from "../../lib/commands"
import { useSqljs } from "../hooks/useDB"
import { DataConnection, DataConnectionConfigs } from "../../lib/sqltr/connections"
import { SqliteDataConnection } from "../../lib/sqltr/databases/sqlite"
import { QueryPanel } from "../database/querypanel"
import { TabsLayout } from "../../components/navigation/tabslayout"
import { Panel, PanelElement, PanelProps } from "../../components/navigation/panel"
import { DatabasePanel } from "../database/databasepanel"
import { IconButton } from "../ui/iconbutton"
import { Query } from "../../lib/items/query"

export interface MainProps extends PanelProps {
  /** User currently signedin (if any) */
  user?: object
}

/** Main component for SQLighter app which includes activities, sidebar, tabs, etc... */
export default function Main(props: MainProps) {
  // TODO persist currently selected activity in user preferences
  const [activityId, setActivityId] = useState<string>("act_database")

  // currently selected tabId
  const [tabId, setTabId] = useState<string>()
  // list of data models for tabs (actual tabs are rendered on demand)
  const [tabs, setTabs] = useState<{ id: string; component: string; props?: any }[]>([])

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

  async function getDatabaseConnection(url) {
    if (sqljs) {
      const response = await fetch(url)
      const buffer = await response.arrayBuffer()
      const configs: DataConnectionConfigs = {
        client: "sqlite3",
        connection: {
          buffer: new Uint8Array(buffer) as Buffer,
        },
      }

      const connection = await SqliteDataConnection.create(configs, sqljs)
      connection.title = url
      console.debug(`getDatabaseConnection - ${url} opened`, connection)
      return connection
    }
  }

  async function openSomeTestConnection() {
    if (sqljs) {
      const conn1 = await getDatabaseConnection("/test.db")
      conn1.title = "test.db"

      const conn2 = await getDatabaseConnection("/test.db")
      conn2.title = "chinook.db"

      const conn3 = await getDatabaseConnection("/databases/northwind.db")
      conn3.title = "northwind.db"

      setConnection(conn2)
      setConnections([conn1, conn2, conn3])
    } else console.error(`DatabasePanel.handleOpenClick - sqljs engine not loaded`)
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
      // open a new tab with a query panel
      case "sqlighter.viewQuery":
      case "tabs.newTab":
        const query = new Query()
        query.connectionId = connection?.id
        query.sql = command.args?.sql // newTab doesn't have a query
        const tab = { id: query.id, component: "QueryPanel", props: { query } }
        setTabs([tab, ...tabs])
        setTabId(query.id)
        break

      case "tabs.changeTabs":
        console.debug(`changeTabs`, command.args.tabs)
        const changedTabs = command.args.tabs.map((tabElement: ReactElement) =>
          tabs.find((tab) => tabElement.key == tab.id)
        )
        setTabId(command.args.tabId)
        setTabs(changedTabs)
        return

      case "changeActivity":
        setActivityId(command.args.id)
        return

      case "changeConnection":
        setConnection(command.args.item)
        break

      case "changeQuery":
        setTabs([...tabs])
        return

      case "manageConnections":
        if (!connections) {
          // TODO open a custom tab where use can create and configure data connections
          await openSomeTestConnection()
        }
        break
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
        case "QueryPanel":
          const query = tab.props.query
          return (
            <QueryPanel
              key={query.id}
              id={query.id}
              title={query.title}
              icon="query"
              connections={connections}
              query={query}
              onCommand={handleCommand}
            />
          )
      }
    })
  }

  function renderEmpty() {
    return <>Your queries will appear here once you create a tab</>
  }

  return (
    <TabsLayout
      title="SQLighter"
      description="Lighter, mightier"
      //
      activityId={activityId}
      activities={renderActivities()}
      //
      tabId={tabId}
      tabs={tabs ? renderTabs() : []}
      tabsCommands={[
        {
          command: "tabs.newTab",
          title: "New Tab",
          icon: "add",
        },
      ]}
      //
      user={props.user}
      //
      onCommand={handleCommand}
    />
  )
}
