//
// databasepanel.tsx - panel used to show information regarding a database connection (info, tables, etc)
//

// libs
import React from "react"
import { useState, useRef } from "react"
import { Theme, SxProps } from "@mui/material"
import { Allotment } from "allotment"
import { format } from "sql-formatter"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import Stack from "@mui/material/Stack"
import useMediaQuery from "@mui/material/useMediaQuery"

// model
import { Command } from "../../lib/commands"
import { DataConnection } from "../../lib/data/connections"
import Query, { QueryRun } from "../../lib/items/query"

// components
import { Icon } from "../ui/icon"
import { IconButton } from "../ui/iconbutton"
import { IconButtonGroup } from "../ui/iconbuttongroup"
import { PanelProps } from "../navigation/panel"
import { Tabs } from "../navigation/tabs"
import { ConnectionPicker } from "../database/connectionpicker"
import { SqlEditor } from "../editor/sqleditor"
import { QueryRunPanel } from "../database/queryrunpanel"
import { useForceUpdate } from "../hooks/useforceupdate"
import { TitleField } from "../ui/titlefield"
import { Empty } from "../ui/empty"
import { Section } from "../ui/section"
import { DatabaseSchemaPanel } from "./databaseschemapanel"
import { TabsPanel } from "../navigation/tabspanel"

// styles applied to main and subcomponents
const DatabasePanel_SxProps: SxProps<Theme> = {
  width: 1,
  minWidth: 360,
  height: 1,
  maxHeight: 1,

  paddingTop: 1.5,
  paddingLeft: 1,
  paddingRight: 1,
  paddingBottom: 1,
}

export interface DatabasePanelProps extends PanelProps {
  /** Connection rendered by this panel */
  connection: DataConnection
}

/** Panel used to edit and run database queries, show results  */
export function DatabasePanel(props: DatabasePanelProps) {
  const { connection, onCommand } = props

  //
  // state
  //

  // layout changes on medium and large screens
  const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"))

  // currently selected tab
  const [tabId, setTabId] = useState<string>("tab_schema")

  // used to force a refresh when data model changes
  const forceUpdate = useForceUpdate()
  function notifyChanges() {
    forceUpdate()
    if (props.onCommand) {
      props.onCommand(null, {
        command: "changedConnection",
        args: {
          item: connection,
        },
      })
    }
  }

  /** Commands shown below section title */
  const commands: (Command | "spacing")[] = [
    { command: "info", icon: "info", title: "Details" },
    { command: "bookmark", icon: "bookmark", title: "Bookmark" },
    { command: "history", icon: "history", title: "History" },
    "spacing",
    { command: "prettify", icon: "autofix", title: "Prettify" },
    "spacing",
    { command: "comment", icon: "comment", title: "Comments" },
    { command: "share", icon: "share", title: "Share" },
  ]

  const actionCmd: Command = {
    command: "print",
    title: "Print",
    description: "Print this document",
    icon: "print",
  }

  const tabs = [
    <DatabaseSchemaPanel id="tab_schema" title="Schema" icon="database" connection={connection} />,
    <DatabaseSchemaPanel id="tab_schema2" title="Schema" icon="database" connection={connection} />,
    <DatabaseSchemaPanel id="tab_schema3" title="Schema" icon="database" connection={connection} />,
  ]

  //
  // handlers
  //

  async function handleCommand(e: React.SyntheticEvent, command: Command) {
    console.debug(`DatabasePanel.handleCommand - ${command.command}`, command)
    switch (command.command) {
      case "changedTabs":
        setTabId(command.args.id)
        break

      case "changedConnection":
        notifyChanges()
        return
    }

    // propagate commands
    props.onCommand(e, command)
  }

  //
  // render
  //

  return (
    <TabsPanel
      className="DatabasePanel-root"
      title={connection.title}
      description="short description of panel like 8 tables"
      commands={commands}
      action={actionCmd}
      tabId={tabId}
      tabs={tabs}
      onCommand={handleCommand}
    />
  )
}
