//
// databasepanel.tsx - show info on a database connection (stats, schema, etc)
//

// libs
import React from "react"
import { useState, useEffect } from "react"

// model
import { Command } from "../../lib/commands"
import { DataConnection, DataSchema } from "../../lib/data/connections"
import { prettyBytes } from "../../lib/shared"

// components
import { PanelProps } from "../navigation/panel"
import { DatabaseSchemaPanel } from "./databaseschemapanel"
import { TabsPanel } from "../navigation/tabspanel"

export interface DatabasePanelProps extends PanelProps {
  /** Connection rendered by this panel */
  connection: DataConnection
}

/** Panel used to edit and run database queries, show results  */
export function DatabasePanel(props: DatabasePanelProps) {
  //
  // state
  //

  // schema are requested asynchronously from connection
  const [schemas, setSchemas] = useState<DataSchema[]>(null)
  useEffect(() => {
    props.connection.getSchemas(false).then((schemas) => {
      setSchemas(schemas)
    })
  }, [props.connection])

  // currently selected tab
  const [tabId, setTabId] = useState<string>("tab_schema")

  // can download entire database?
  const canDownload = props.connection.canExport()
  const downloadCommand: Command = {
    command: "downloadDatabase",
    title: "Download",
    description: "Download Database",
    icon: "download",
  }

  /** Commands shown below section title */
  const commands: (Command | "spacing")[] = []
  if (canDownload) {
    commands.push(downloadCommand)
  }

  const tabs = [
    <DatabaseSchemaPanel id="tab_schema" title="Schema" icon="database" connection={props.connection} />,
  ]

  //
  //
  //

  /** Export entire SQLite database */
  async function downloadDatabase() {
    const exportData = await props.connection.export()
    if (exportData) {
      var blob = new Blob([exportData.data], { type: exportData.type })
      var link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = props.connection.title
      link.click()
    }
  }

  //
  // handlers
  //

  async function handleCommand(event: React.SyntheticEvent, command: Command) {
    console.debug(`DatabasePanel.handleCommand - ${command.command}`, command)
    switch (command.command) {
      case "changedTabs":
        setTabId(command.args.id)
        break

      case "downloadDatabase":
        await downloadDatabase()
        break
    }

    if (props.onCommand) {
      props.onCommand(event, command)
    }
  }

  //
  // render
  //

  /** Extract from schema something like: 11 tables, 15607 rows, 864 kB */
  function renderDescription() {
    // TODO consider multiple schemas for non SQLite scenarios (or attached SQLite databases other than 'main')
    const schema = schemas?.[0]
    if (!schema) {
      return "Loading schema..."
    }

    const labels: string[] = []

    if (schema.tables) {
      labels.push(`${schema.tables.length} tables`)

      // count total rows
      let rows = schema.tables.reduce((t1, t2) => t1 + t2.stats?.rows, 0)
      if (rows > 0) {
        labels.push(`${rows} rows`)
      }
    }

    if (schema.stats?.size > 0) {
      labels.push(prettyBytes(schema.stats.size))
    }

    return labels.join(", ")
  }

  return (
    <TabsPanel
      className="DatabasePanel-root"
      title={props.connection.title}
      description={renderDescription()}
      commands={commands}
      action={canDownload && downloadCommand}
      tabId={tabId}
      tabs={tabs}
      onCommand={handleCommand}
    />
  )
}
