//
// app.tsx - sqlighter as a full page application
//

import * as React from "react"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import Head from "next/head"

import Box from "@mui/material/Box"
import { useTheme } from "@mui/material/styles"
import { Typography } from "@mui/material"

import { useSqljs } from "../../lib/useDB"
import { DataConnection, DataConnectionConfigs } from "../../lib/sqltr/connections"
import { SqliteDataConnection } from "../../lib/sqltr/databases/sqlite"

import { Icon } from "../../components/ui/icon"
import { Context } from "../../components/context"
import { TabsLayout } from "../../components/navigation/tabslayout"
import { PanelProps } from "../../components/navigation/panel"
import { DatabasePanel } from "./databasepanel"

const SSR = typeof window === "undefined"

const TABS: PanelProps[] = [
  {
    id: "tab0",
    title: "Query 0",
    description: "description of tab 0",
    icon: "query",
    //sx: { backgroundColor: "beige", width: "100%", height: "100%" },
    children: <>Tab zero panel</>,
  },
  {
    id: "tab1",
    title: "Query 1",
    description: "description of tab 1",
    icon: "query",
    //sx: { backgroundColor: "blue", width: "100%", height: "100%" },
    children: <>Tab 1 panel</>,
  },
  {
    id: "tab2",
    title: "Table 2",
    description: "description of tab 3",
    icon: "database",
    //sx: { backgroundColor: "yellow", width: "100%", height: "100%" },
    children: <>Tab 2 panel</>,
  },
  {
    id: "tab3",
    title: "Table 3",
    description: "description of tab 3",
    icon: "database",
    //sx: { backgroundColor: "yellow", width: "100%", height: "100%" },
    children: <>Tab 3 panel</>,
  },
]

/*
const SQLighterComponentWithNoSSR = dynamic(
  () => import('../components/layouts/tabsapp'),
  { ssr: false }
)
*/

const title = "SQLighter"

/** Main component for SQLighter app which includes activities, sidebar, tabs, etc... */
export default function Main(props) {
  //  <SQLighterComponentWithNoSSR />
  const context = React.useContext(Context)

  const [activityValue, setActivityValue] = useState("databaseActivity")
  const [tabValue, setTabValue] = useState("tab1")
  const [tabs, setTabs] = useState(TABS)

  // all connections
  const [connections, setConnections] = useState<DataConnection[]>(null)

  // selected connection
  const [connection, setConnection] = useState<DataConnection>(null)

  //
  // temporary code while we work out the connection setup panels, etc
  //

  const sqljs = useSqljs()
  useEffect(() => {
    if (sqljs) {
      console.log("DatabasePanel - has sqljs")
    }
  }, [sqljs])

  async function openSomeTestConnection() {
    if (sqljs) {
      //      const response = await fetch("/chinook.sqlite")
      const response = await fetch("/test.db")
      const buffer = await response.arrayBuffer()
      console.log("downloaded", response, buffer)
      const configs: DataConnectionConfigs = {
        client: "sqlite3",
        connection: {
          buffer: new Uint8Array(buffer) as Buffer,
        },
      }

      const conn = await SqliteDataConnection.create(configs, sqljs)
      console.debug(`openSomeTestConnection - opened`, conn)
      // faking it a bit for now to have a list of connections
      setConnection(conn)
      setConnections([conn, conn, conn])
    } else [console.error(`DatabasePanel.handleOpenClick - sqljs engine not loaded`)]
  }

  //
  // activities
  //

  const activities: PanelProps[] = [
    {
      id: "databaseActivity",
      title: "Database",
      description: "Database Schema",
      icon: "database",
      sx: { width: "100%", height: "100%" },
      children: <DatabasePanel connection={connection} connections={connections} onCommand={handleCommand} />,
    },
    {
      id: "queriesActivity",
      title: "Queries",
      description: "Saved Queries",
      icon: "query",
      sx: { width: "100%", height: "100%" },
      children: <>Saved queries activity</>,
    },
    {
      id: "historyActivity",
      title: "History",
      description: "History description",
      icon: "history",
      children: <>History activity</>,
    },
  ]

  //
  // handlers
  //

  function handleActivityChange(_, activityId) {
    console.debug(`App.handleActivityChange - activityId: ${activityId}`)
  }

  function handleTabsChange(tabId?: string, tabs?: PanelProps[]) {
    console.debug(`handleTabsChange - tabId: ${tabId}, tabs: ${tabs && tabs.map((t) => t.id).join(", ")}`)
    setTabs(tabs)
    setTabValue(tabId)
  }

  function handleAddTabClick(e: React.MouseEvent<HTMLElement>): void {
    // console.debug("Main.handleAddTabClick", e)
  }

  async function handleCommand(event: React.SyntheticEvent, command: string, args) {
    console.debug(`Main.handleCommand - ${command}`, args)
    switch (command) {
      case "sqlighter.manageConnections":
        await openSomeTestConnection()
        break
    }
  }

  //
  // rendering
  //

  return (
    <TabsLayout
      title="SQLighter"
      description="Lighter, mightier"
      //
      activities={activities}
      onActivityChange={handleActivityChange}
      //
      tabs={tabs}
      onTabsChange={handleTabsChange}
      onAddTabClick={handleAddTabClick}
      //
      user={context.user}
    />
  )
}
