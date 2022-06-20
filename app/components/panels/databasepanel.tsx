//
// databasepanel.tsx - show info on a database connection (stats, schema, etc)
//

// libs
import React from "react"
import { useState, useEffect } from "react"
import { Theme, SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"

// model
import { Command } from "../../lib/commands"
import { DataConnection, DataSchema } from "../../lib/data/connections"
import { prettyBytes } from "../../lib/shared"

// components
import { PanelProps } from "../navigation/panel"
import { TablesSchemaPanel, IndexesSchemaPanel, TriggersSchemaPanel } from "./schemapanels"
import { Section } from "../ui/section"
import { Tabs } from "../navigation/tabs"

// styles applied to main and subcomponents
const DatabasePanel_SxProps: SxProps<Theme> = {
  width: 1,
  minWidth: 360,
  height: 1,
  maxHeight: 1,

  paddingTop: 2,
  paddingBottom: 1,
  paddingLeft: 3,
  paddingRight: 3,

  ".DatabasePanel-section": {
    height: 1,
  },
  ".DatabasePanel-card": {
    height: 1,

    marginLeft: -2,
    marginRight: -2,
  },
}

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

  // TODO consider multiple schemas for non SQLite scenarios (or attached SQLite databases other than 'main')
  const schema = schemas?.[0]

  // currently selected tab
  const [tabId, setTabId] = useState<string>("tab_tables")

  //
  // handlers
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

  async function handleCommand(event: React.SyntheticEvent, command: Command) {
    console.debug(`DatabasePanel.handleCommand - ${command.command}`, command)
    switch (command.command) {
      case "changedTabs":
        setTabId(command.args.id)
        return

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

  /** Commands are used as actions but also to show metadata */
  function renderCommands() {
    // can download entire database?
    const canDownload = props.connection.canExport()
    const commands = []

    if (schema) {
      const size = schema.stats?.size | 0
      commands.push({
        command: "openQuery",
        title: prettyBytes(size),
        icon: "database",
        args: {
          label: true,
          connection: props.connection,
          database: schema.database,
          sql: "SELECT page_count * page_size AS 'Size' FROM pragma_page_count(), pragma_page_size();",
        },
      })

      const tables = schema.tables?.length | 0
      commands.push({
        command: "openQuery",
        title: `${tables} tables`,
        icon: "table",
        args: {
          label: true,
          connection: props.connection,
          database: schema.database,
          sql: "SELECT COUNT(*) AS 'Tables' FROM sqlite_schema WHERE type == 'table'",
        },
      })

      // count total rows
      let rows = schema.tables ? schema.tables.reduce((t1, t2) => t1 + t2.stats?.rows, 0) : 0
      commands.push({
        command: "openQuery",
        title: `${rows} rows`,
        icon: "rows",
        args: {
          label: true,
          connection: props.connection,
          database: schema.database,
          // TODO DatabaseTable / sql query to calculate total number of rows in database #48
          sql: "SELECT COUNT(*) AS 'Tables' FROM sqlite_schema WHERE type == 'table'",
        },
      })

      if (commands.length > 0 && canDownload) {
        commands.push("divider")
      }
    }

    if (canDownload) {
      commands.push({
        command: "downloadDatabase",
        title: "Download",
        description: "Download Database",
        icon: "download",
        args: {
          label: true,
          color: "primary",
        },
      })
    }

    return commands
  }

  /** Panels to be rendered as tabs */
  function renderTabs() {
    return [
      <TablesSchemaPanel
        id="tab_tables"
        title="Tables"
        icon="table"
        connection={props.connection}
        schema={schema}
        onCommand={handleCommand}
        variant="tables"
      />,
      <TablesSchemaPanel
        id="tab_views"
        title="Views"
        icon="table"
        connection={props.connection}
        schema={schema}
        onCommand={handleCommand}
        variant="views"
      />,
      <IndexesSchemaPanel
        id="tab_indexes"
        title="Indexes"
        icon="index"
        connection={props.connection}
        schema={schema}
        onCommand={handleCommand}
      />,
      <TriggersSchemaPanel
        id="tab_triggers"
        title="Triggers"
        icon="trigger"
        connection={props.connection}
        schema={schema}
        onCommand={handleCommand}
      />,
    ]
  }

  return (
    <Box className="DatabasePanel-root" sx={DatabasePanel_SxProps}>
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
