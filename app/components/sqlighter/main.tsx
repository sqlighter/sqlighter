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
import { Allotment } from "allotment"

import { Command, CommandEvent } from "../../lib/commands"
import { useSqljs } from "../hooks/useDB"
import { DataConnection, DataConnectionConfigs } from "../../lib/sqltr/connections"
import { SqliteDataConnection } from "../../lib/sqltr/databases/sqlite"
import { createQueryTab } from "../database/querytab"

import { Icon } from "../../components/ui/icon"
import { Context } from "../../components/context"
import { TabsLayout } from "../../components/navigation/tabslayout"
import { PanelProps } from "../../components/navigation/panel"
import { DatabasePanel } from "../database/databasepanel"
import { QueryTab } from "../database/querytab"

const SSR = typeof window === "undefined"



const TABS: PanelProps[] = [
  {
    id: "tab0",
    title: "Query 0",
    description: "description of tab 0",
    icon: "query",
    sx: { backgroundColor: "beige" },
    children: <>Tab zero panel</>,
  },
  {
    id: "tab1",
    title: "QueryTab 1",
    description: "description of tab 1",
    icon: "query",
    sx: { backgroundColor: "blue" },
    children: <QueryTab sql="select * from tracks" variant="right" />,
  },
  {
    id: "tab2",
    title: "LongText2",
    description: "description of tab 3",
    icon: "database",
    sx: { backgroundColor: "yellow" },
    children: <Box sx={{ backgroundColor: "yellow" }}>some really really long text</Box>,
  },
  {
    id: "tab3",
    title: "Table 3",
    description: "description of tab 3",
    icon: "database",
    sx: { backgroundColor: "yellow", height: "100%", maxHeight: "100%" },
    children: <>Tab 3 panel full height</>,
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
  const [tabs, setTabs] = useState<PanelProps[]>(TABS)

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

  async function handleCommand(event: React.SyntheticEvent, command: Command) {
    console.debug(`Main.handleCommand - ${command.command}`, command)
    switch (command.command) {
      case "sqlighter.manageConnections":
        await openSomeTestConnection()
        break

      case "sqlighter.viewQuery":
        // open a new tab with a query panel
        const queryTab = createQueryTab(command, connection, connections)
        setTabs([queryTab, ...tabs])
        setTabValue(queryTab.id)
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
