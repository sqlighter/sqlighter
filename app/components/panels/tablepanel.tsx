//
// tablepanel.tsx - shows schema and data for a database table
//

// libs
import React, { useState, useEffect } from "react"
import { Theme, SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"

// model
import { Command } from "../../lib/commands"
import { DataConnection, DataSchema } from "../../lib/data/connections"

// components
import { PanelProps } from "../navigation/panel"
import { Section } from "../ui/section"
import { ColumnsSchemaPanel, IndexesSchemaPanel, RelationsSchemaPanel, TriggersSchemaPanel } from "./schemapanels"
import { Tabs } from "../navigation/tabs"

// styles applied to main and subcomponents
const TablePanel_SxProps: SxProps<Theme> = {
  width: 1,
  minWidth: 360,
  height: 1,
  maxHeight: 1,

  paddingTop: 1,
  paddingBottom: 1,
  paddingLeft: 3,
  paddingRight: 3,

  ".TablePanel-section": {
    height: 1,
  },

  ".TablePanel-card": {
    height: 1,
    marginLeft: -2,
    marginRight: -2,
  },
}

export interface TablePanelProps extends PanelProps {
  /** Connection rendered by this panel */
  connection: DataConnection
  /** Database for which we're showing the table */
  database: string
  /** Name of table to be shown */
  table: string
  /** Showing a table or view, default: table */
  variant?: "table" | "view"
}

/** Shows schema and data of a database table  */
export function TablePanel(props: TablePanelProps) {
  console.debug()
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

  // select the schema for the required database
  const schema = schemas?.find((schema) => schema.database == props.database)

  /** Schema of the table (or view) being shown */
  const table =
    props.variant == "view"
      ? schema?.views?.find((v) => v.name == props.table)
      : schema?.tables?.find((t) => t.name == props.table)

  // currently selected tab
  const [tabId, setTabId] = useState<string>("tab_columns")

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
        //notifyChanges()
        return
    }

    // propagate commands
    props.onCommand(e, command)
  }

  //
  // render
  //

  /** Commands are used as actions but also to show metadata */
  function renderCommands() {
    const commands = []

    if (table) {
      const columns = table.columns?.length
      commands.push({
        command: "openQuery",
        title: `${columns} columns`,
        icon: "columns",
        args: {
          label: true,
          connection: props.connection,
          database: props.database,
          sql: `pragma '${props.database}'.table_info('${props.table}')`,
        },
      })

      // count total rows
      let rows = table.stats?.rows
      commands.push({
        command: "openQuery",
        title: `${rows} rows`,
        icon: "rows",
        args: {
          label: true,
          connection: props.connection,
          database: props.database,
          sql: `SELECT COUNT(*) 'NumberOfRows' FROM '${props.database}'.'${props.table}'`,
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

    commands.push("divider")
    commands.push({
      command: "openQuery",
      title: "Query Data",
      icon: "code",
      args: {
        // render button with label and color
        label: true,
        color: "primary",
        // query panel specs
        title: `All ${props.table}`,
        connection: props.connection,
        database: props.database,
        sql: `SELECT * FROM '${props.database}'.'${props.table}'`,
      },
    })
    // more commands...

    return commands
  }

  /** Panels to be rendered as tabs */
  function renderTabs() {
    return [
      <ColumnsSchemaPanel
        id="tab_columns"
        title="Columns"
        icon="columns"
        connection={props.connection}
        schema={schema}
        table={props.table}
        variant={props.variant}
        onCommand={handleCommand}
      />,
      <IndexesSchemaPanel
        id="tab_indexes"
        title="Indexes"
        icon="index"
        connection={props.connection}
        schema={schema}
        table={props.table}
        onCommand={handleCommand}
      />,
      <RelationsSchemaPanel
        id="tab_relations"
        title="Relations"
        icon="relations"
        connection={props.connection}
        schema={schema}
        table={props.table}
        variant={props.variant}
        onCommand={handleCommand}
      />,
      <TriggersSchemaPanel
        id="tab_triggers"
        title="Triggers"
        icon="trigger"
        connection={props.connection}
        schema={schema}
        table={props.table}
        onCommand={handleCommand}
      />,
    ]
  }

  return (
    <Box className="TablePanel-root" sx={TablePanel_SxProps}>
      <Section
        className="TablePanel-section"
        title={props.table}
        description={`A ${props.connection.title?.toLowerCase()} ${props.variant || "table"}`}
        commands={renderCommands()}
        onCommand={props.onCommand}
      >
        <Card className="TablePanel-card" variant="outlined" square={true}>
          <Tabs
            className="TablePanel-tabs"
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
