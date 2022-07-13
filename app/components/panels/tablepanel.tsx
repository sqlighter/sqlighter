//
// TablePanel.tsx - shows data, columns, indexes, relations and triggers for tables or views
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
import { TableDataPanel } from "./tabledatapanel"

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
  variant: "table" | "view"
  /** Given item should be selected, eg. columns/title (optional) */
  selection?: string
}

/** Shows schema and data of a database table  */
export function TablePanel(props: TablePanelProps) {
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

  // currently selected tab, use data initially unless a selection has been specified
  const [tabId, setTabId] = useState<string>("tab_rows")
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

  function handleCommand(event: React.SyntheticEvent, command: Command) {
    switch (command.command) {
      case "changeTabs":
        setTabId(command.args.tabId)
        setTabSelection(undefined)
        return
    }

    // propagate commands
    if (props.onCommand) {
      props.onCommand(event, command)
    }
  }

  //
  // render
  //

  /** Commands are used as actions but also to show metadata */
  function renderCommands() {
    const commands = []

    if (table) {
      const columns = table.columns?.length
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
      // count total columns
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
      command: "export",
      title: "Export CSV",
      icon: "export",
      args: {
        filename: `${props.table}.csv`,
        format: "csv",
        connection: props.connection,
        database: props.database,
        table: props.table,
      },
    })

    commands.push({
      command: "openQuery",
      title: "Query Data",
      icon: "query",
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
    const tabs = [
      <TableDataPanel
        id="tab_rows"
        title="Rows"
        icon="rows"
        connection={props.connection}
        schema={schema}
        table={props.table}
        variant={props.variant}
        onCommand={handleCommand}
      />,
      <ColumnsSchemaPanel
        id="tab_columns"
        title="Columns"
        icon="columns"
        connection={props.connection}
        schema={schema}
        table={props.table}
        selection={tabSelection}
        variant={props.variant}
        onCommand={handleCommand}
      />,
    ]

    if (props.variant != "view") {
      tabs.push(
        <IndexesSchemaPanel
          id="tab_indexes"
          title="Indexes"
          icon="index"
          connection={props.connection}
          schema={schema}
          table={props.table}
          selection={tabSelection}
          variant={props.variant}
          onCommand={handleCommand}
        />
      )
    }

    tabs.push(
      <RelationsSchemaPanel
        id="tab_relations"
        title="Relations"
        icon="relations"
        connection={props.connection}
        schema={schema}
        table={props.table}
        selection={tabSelection}
        variant={props.variant}
        onCommand={handleCommand}
      />
    )
    tabs.push(
      <TriggersSchemaPanel
        id="tab_triggers"
        title="Triggers"
        icon="trigger"
        connection={props.connection}
        schema={schema}
        table={props.table}
        selection={tabSelection}
        variant={props.variant}
        onCommand={handleCommand}
      />
    )
    return tabs
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
