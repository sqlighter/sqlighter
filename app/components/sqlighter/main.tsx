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
import { SqliteDataConnection } from "../../lib/data/clients/sqlite"
import { QueryPanel } from "../database/querypanel"
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

  async function getDatabaseConnection(url, title) {
    if (sqljs) {
      const connection = await SqliteDataConnection.create(
        {
          client: "sqlite3",
          title,
          connection: {
            url,
          },
        },
        sqljs
      )
      console.debug(`getDatabaseConnection - ${url} opened`, connection)
      return connection
    }
  }

  async function openSomeTestConnection() {
    if (sqljs) {
      const conn1 = await getDatabaseConnection("/test.db", "test.db")
      const conn2 = await getDatabaseConnection("/test.db", "chinook.db")
      const conn3 = await getDatabaseConnection("/databases/northwind.db", "northwind.db")

      setConnection(conn2)
      setConnections([conn1, conn2, conn3])
    } else console.error(`DatabasePanel.handleOpenClick - sqljs engine not loaded`)
  }

  async function openFile(file: File | FileSystemFileHandle) {
    console.debug(`openFile - ${typeof file}, typeof: ${typeof file}`, file)

    if (file instanceof FileSystemFileHandle) {
      file = await file.getFile()
    }

    const connection = await SqliteDataConnection.create(
      {
        client: "sqlite3",
        connection: {
          file,
        },
      },
      sqljs
    )

    setConnection(connection)
    setConnections([connection, ...(connections || [])])
  }

  //
  // activities
  //

  //
  // handlers
  //

  async function handleOpenFile(event) {
    const pickerOpts = {
      types: [
        {
          description: "SQLite",
          accept: {
            "application/*": [".db", ".sqlite"],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false,
    }

    const [fileHandle] = await (window as any).showOpenFilePicker(pickerOpts)
    if (fileHandle) {
      console.debug(`handleOpenFile - fileHandle: $`)
      await openFile(fileHandle)
    }
  }

  async function handleCommand(event: React.SyntheticEvent, command: Command) {
    console.debug(`Main.handleCommand - ${command.command}`, command)
    switch (command.command) {
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

      case "dropFiles":
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
        case "QueryPanel":
          const query = tab.props.query
          return (
            <QueryPanel
              key={query.id}
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
          <Button variant="outlined" sx={{ mt: 2 }} onClick={handleOpenFile}>
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
      //
      activityId={activityId}
      activities={renderActivities()}
      //
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
      //
      user={props.user}
      //
      onCommand={handleCommand}
    />
  )
}
