//
// app.tsx - sqlighter as a full page application
//

import React, { ReactElement } from "react"
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
import { Tab, TabProps } from "../../components/navigation/tabs"
import { DatabasePanel } from "../database/databasepanel"
import { QueryTab } from "../database/querytab"

const SSR = typeof window === "undefined"

function Scatolo(props: any) {
  return <>{props.children}</>
}

const TABS: React.ReactElement[] = [
  <Scatolo id="tab0" title="Tab0" icon="query" ciccio="pippo">
    Tab zero panel
  </Scatolo>,
  <QueryTab id="tab1" title="QueryTab1" icon="query" sql="select * from tracks" variant="right" />,
  <Scatolo id="tab2" title="Tab2" icon="database">
    some really really long text
  </Scatolo>,
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

  const [tabId, setTabId] = useState(TABS[0].props.id)
  const [tabs, setTabs] = useState<ReactElement[]>(TABS)

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

  

  //
  // handlers
  //

  function handleActivityChange(_, activityId) {
    console.debug(`App.handleActivityChange - activityId: ${activityId}`)
  }
  /*
  function handleTabsChange(tabId?: string, tabs?: PanelProps[]) {
    console.debug(`handleTabsChange - tabId: ${tabId}, tabs: ${tabs && tabs.map((t) => t.id).join(", ")}`)
    setTabs(tabs)
    setTabValue(tabId)
  }
*/
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
        setTabId(queryTab.props.id)
        setTabs([queryTab, ...tabs])
        break

      case "tabs.changeTabs":
        setTabId(command.args.tabId)
        setTabs(command.args.tabs)
        break
    }
  }

  //
  // rendering
  //

  function renderActivities() {
    return [
      {
        id: "databaseActivity",
        title: "Database",
        description: "Database Schema",
        icon: "database",
        children: <DatabasePanel connection={connection} connections={connections} onCommand={handleCommand} />,
      },
      {
        id: "queriesActivity",
        title: "Queries",
        description: "Saved Queries",
        icon: "query",
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
  }

  return (
    <TabsLayout
      title="SQLighter"
      description="Lighter, mightier"
      //
      activities={renderActivities()}
      onActivityChange={handleActivityChange}
      //
      tabId={tabId}
      //      onTabsChange={handleTabsChange}
      //      onAddTabClick={handleAddTabClick}
      onCommand={handleCommand}
      //
      user={context.user}
    >
      {tabs}
    </TabsLayout>
  )
}
