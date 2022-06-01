//
// app.tsx - sqlighter as a full page application
//

import React, { ReactElement } from "react"
import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { Command } from "../../lib/commands"
import { useSqljs } from "../hooks/useDB"
import { DataConnection, DataConnectionConfigs } from "../../lib/sqltr/connections"
import { SqliteDataConnection } from "../../lib/sqltr/databases/sqlite"
import { QueryPanel } from "../database/querypanel"
import { Context } from "../../components/context"
import { TabsLayout } from "../../components/navigation/tabslayout"
import { Panel, PanelProps, PanelElement } from "../../components/navigation/panel"
import { DatabasePanel } from "../database/databasepanel"
import { IconButton } from "../ui/iconbutton"

import { Query } from "../../lib/items/query"
import { query } from "express"

const SSR = typeof window === "undefined"

/*
const SQLighterComponentWithNoSSR = dynamic(
  () => import('../components/layouts/tabsapp'),
  { ssr: false }
)
*/

const title = "SQLighter"

export interface MainProps {
  pippo?: string
}

/** Main component for SQLighter app which includes activities, sidebar, tabs, etc... */
export default function Main(props) {
  //  <SQLighterComponentWithNoSSR />
  const context = React.useContext(Context)

  // TODO persist currently selected activity in user preferences
  const [activityId, setActivityId] = useState<string>("act_database")

  // currently selected tabId
  const [tabId, setTabId] = useState<string>("tab_0")
  // list of data models for tabs (actual tabs are rendered on demand)
  const [tabsData, setTabsData] = useState<(ReactElement | Query)[]>([
    <Panel id="tab_0" title="Tab 0" icon="query">
      Tab0
      <Box>
        <IconButton command={{ command: "Print", icon: "database" }} onCommand={handleCommand} size="small" />
      </Box>
      <IconButton command={{ command: "openQuery", title: "Open Query", icon: "query" }} onCommand={handleCommand} />
      more
    </Panel>,
    <Panel id="tab_1" title="Tab 1" icon="query">
      Tab1
    </Panel>,
    <Panel id="tab_2" title="Tab 2" icon="query">
      Tab2
    </Panel>,
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
      case "sqlighter.viewQuery":
        {
          // open a new tab with a query panel
          const query = new Query()
          query.connectionId = connection.id
          query.sql = command.args.sql
          setTabsData([query, ...tabsData])
          setTabId(query.id)
        }
        break

      case "tabs.changeTabs":
        setTabId(command.args.tabId)
        setTabsData(command.args.tabs)
        return

      case "tabs.newTab":
        {
          const query = new Query()
          query.connectionId = connection.id
          query.sql = command.args.sql
          setTabsData([query, ...tabsData])
          setTabId(query.props.id)
        }
        break

      case "changeActivity":
        setActivityId(command.args.id)
        return

      case "changeConnection":
        setConnection(command.args.connection)
        break

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

  function renderTabs() {
    return tabsData.map(tab => {
      if (tab instanceof Query) {
        const tabQuery = tab as Query
        return <QueryPanel id={tabQuery.id} title={tabQuery.title} icon="query" connections={connections} query={tabQuery} />
      }

      return tab
    })
  }

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

  return (
    <TabsLayout
      title="SQLighter"
      description="Lighter, mightier"
      //
      activityId={activityId}
      activities={renderActivities()}
      //
      tabId={tabId}
      tabs={renderTabs()}
      tabsCommands={[
        {
          command: "tabs.newTab",
          title: "New Tab",
          icon: "add",
        },
      ]}
      //
      user={context.user}
      //
      onCommand={handleCommand}
    />
  )
}
