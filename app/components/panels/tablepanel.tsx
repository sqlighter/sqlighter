//
// tablepanel.tsx - shows schema and data for a database table
//

// libs
import React, { useState } from "react"
import { Theme, SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"

// model
import { Command } from "../../lib/commands"
import { DataConnection } from "../../lib/data/connections"

// components
import { PanelProps } from "../navigation/panel"
import { Section } from "../ui/section"
import { TablesSchemaPanel, IndexesSchemaPanel, TriggersSchemaPanel } from "./schemapanels"
import { Tabs } from "../navigation/tabs"
import { useForceUpdate } from "../hooks/useforceupdate"

// styles applied to main and subcomponents
const TablePanel_SxProps: SxProps<Theme> = {
  width: 1,
  minWidth: 360,
  height: 1,
  maxHeight: 1,
  padding: 1,

  ".TablePanel-section": {
    height: 1,
  },
  ".TablePanel-card": {
    height: 1,
  },
}

export interface TablePanelProps extends PanelProps {
  /** Connection rendered by this panel */
  connection: DataConnection

  /** Name of table to be shown */
  table: string
}

/** Shows schema and data of a database table  */
export function TablePanel(props: TablePanelProps) {
  //
  // state
  //

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
          item: props.connection,
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
    <TableSchemaPanel id="tab_schema" title="Schema" icon="table"  />,
    <TableDataPanel id="tab_data" title="Data" icon="database" />,
  ]

  //
  // handlers
  //

  async function handleCommand(e: React.SyntheticEvent, command: Command) {
    console.debug(`TablePanel.handleCommand - ${command.command}`, command)
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

  function renderCommands() {}
  function renderTabs() {}

  return (
    <Box className="DatabasePanel-root" sx={TablePanel_SxProps}>
      <Section
        className="DatabasePanel-section"
        title={props.connection.title}
        description={`A ${props.connection.configs.client} database`}
        commands={renderCommands()}
        variant="large"
        onCommand={props.onCommand}
      >
        <Card className="DatabasePanel-card" variant="outlined" square={true}>
          <Tabs
            className="DatabasePanel-tabs"
            tabId={tabId}
            tabs={renderTabs()}
            onCommand={handleCommand}
            variant="below"
          />
        </Card>
      </Section>
    </Box>
  )
  }

//
// TableSchemaPanel 
//

export interface TableSchemaPanelProps extends PanelProps {

}

export function TableSchemaPanel(props: TableSchemaPanelProps) {
  return <>Table schema goes here</>
} 

//
// TableDataPanel
//

export interface TableDataPanelProps extends PanelProps {

}

export function TableDataPanel(props: TableSchemaPanelProps) {
  return <>Table data goes here</>
} 
