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

import { Command, CommandEvent, CommandIconButton } from "../commands"
import { useSqljs } from "../hooks/useDB"
import { DataConnection, DataConnectionConfigs } from "../../lib/sqltr/connections"
import { SqliteDataConnection } from "../../lib/sqltr/databases/sqlite"
import { createQueryTab } from "../database/querytab"

import { Icon } from "../../components/ui/icon"
import { Context } from "../../components/context"
import { TabsLayout } from "../../components/navigation/tabslayout"
import { Panel, PanelProps, PanelElement } from "../../components/navigation/panel"
import { DatabasePanel } from "../database/databasepanel"
import { QueryTab } from "../database/querytab"

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
  // list of
  const [tabs, setTabs] = useState<PanelElement[]>([
    <Panel id="tab_0" title="Tab 0" icon="query">
      Tab0
      <Box>
      <CommandIconButton command={{command: "Print", icon: "database"}} onCommand={handleCommand} size="small" />
      </Box>
      <CommandIconButton command={{command: "openQuery", title: "Open Query", icon: "query"}} onCommand={handleCommand} />
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
        return

      case "changeActivity":
        setActivityId(command.args.id)
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
      <Panel id="act_queries" title="Queries" icon="query">
        Saved queries, pippo: '{props.pippo}'
      </Panel>,
      <Panel id="act_history" title="History" icon="history">
        Bookmarked queries
      </Panel>,
    ]
  }

  const tabsCommands = [
    {
      command: "tabs.createTab",
      title: "Add tab",
      icon: "add",
    },
  ]

  return (
    <TabsLayout
      title="SQLighter"
      description="Lighter, mightier"
      //
      activityId={activityId}
      activities={renderActivities()}
      //
      tabId={tabId}
      tabs={tabs}
      tabsCommands={tabsCommands}
      //
      user={context.user}
      //
      onCommand={handleCommand}
    />
  )
}
