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
import { TitleField } from "../ui/titlefield"

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
  /** Database to which we connect, or main if not specified */
  database?: string
  /** Optional selection string like indexes/indexname */
  selection?: string
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
  let schema = undefined
  if (schemas) {
    schema = props.database ? schemas.find((s) => s.database == props.database) : schemas[0]
  }

  // currently selected tab, use data initially unless a selection has been specified
  const [tabId, setTabId] = useState<string>("tab_tables")
  const [tabSelection, setTabSelection] = useState<string>()
  useEffect(() => {
    if (props.selection) {
      const [panel, item] = props.selection.split("/")
      setTabId("tab_" + panel)
      setTabSelection(item)
    } else {
      setTabSelection(undefined)
    }
  }, [props.selection])

  //
  // handlers
  //

  async function handleCommand(event: React.SyntheticEvent, command: Command) {
    console.debug(`DatabasePanel.handleCommand - ${command.command}`, command)
    switch (command.command) {
      case "changeTabs":
        setTabId(command.args.tabId)
        return

      case "changeTitle":
        if (props.onCommand) {
          props.connection.title = command.args.title
          await props.onCommand(event, {
            command: "changeConnection",
            args: { connection: props.connection },
          })
        }
        return
    }

    if (props.onCommand) {
      await props.onCommand(event, command)
    }
  }

  //
  // render
  //

  /** Commands are used as actions but also to show metadata */
  function renderCommands() {
    // can download entire database? can save directly to fileHandle?
    const canDownload = props.connection.canExport()
    const canSave = canDownload && props.connection?.configs?.connection?.fileHandle

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
          sql: "SELECT COUNT(*) AS 'Tables' FROM sqlite_schema WHERE type == 'table' AND name NOT LIKE 'sqlite_%'",
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
          sql: "SELECT COUNT(*) AS 'Tables' FROM sqlite_schema WHERE type == 'table' AND name NOT LIKE 'sqlite_%'",
        },
      })

      if (commands.length > 0) {
        commands.push("divider")
      }
    }

    commands.push({
      command: "refreshSchema",
      icon: "refresh",
      title: "Refresh Schema",
      args: { connection: props.connection },
    })

    if (canDownload) {
      if (!canSave) {
        commands.push("divider")
      }

      commands.push({
        command: "export",
        title: "Download",
        description: "Download Database",
        icon: "download",
        args: {
          label: canSave ? undefined : true,
          color: canSave ? undefined : "primary",
          format: null, // native format
          filename: props.connection.title,
          connection: props.connection,
        },
      })
    }

    if (canSave) {
      commands.push("divider")
      commands.push({
        command: "save",
        title: "Save",
        description: "Save",
        icon: "save",
        args: {
          label: true,
          color: "primary",
          connection: props.connection,
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
        selection={tabSelection}
        onCommand={handleCommand}
        variant="tables"
      />,
      <TablesSchemaPanel
        id="tab_views"
        title="Views"
        icon="table"
        connection={props.connection}
        schema={schema}
        selection={tabSelection}
        onCommand={handleCommand}
        variant="views"
      />,
      <IndexesSchemaPanel
        id="tab_indexes"
        title="Indexes"
        icon="index"
        connection={props.connection}
        schema={schema}
        selection={tabSelection}
        variant="database"
        onCommand={handleCommand}
      />,
      <TriggersSchemaPanel
        id="tab_triggers"
        title="Triggers"
        icon="trigger"
        connection={props.connection}
        schema={schema}
        selection={tabSelection}
        variant="database"
        onCommand={handleCommand}
      />,
    ]
  }

  // editable connection title
  const title = <TitleField className="DatabasePanel-title" value={props.connection.title} onCommand={handleCommand} />

  return (
    <Box className="DatabasePanel-root" sx={DatabasePanel_SxProps}>
      <Section
        className="DatabasePanel-section"
        title={title}
        description={`A ${props.connection.configs.client} database`}
        commands={renderCommands()}
        variant="large"
        onCommand={handleCommand}
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
