//
// SchemaPanels.tsx - components to show schemas for tables, views, indexes, etc
//

// libs
import React, { ReactElement } from "react"
import { Theme, SxProps } from "@mui/material"
import Badge from "@mui/material/Badge"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { GridColumns, GridRenderCellParams } from "@mui/x-data-grid"

// model
import { Command, CommandEvent } from "../../lib/commands"
import { DataConnection, DataSchema } from "../../lib/data/connections"

// components
import { IconButtonGroup } from "../ui/iconbuttongroup"
import { PanelProps } from "../navigation/panel"
import { DataGrid } from "../navigation/datagrid"

// styles applied to main and subcomponents
const SchemaPanel_SxProps: SxProps<Theme> = {
  width: 1,
  height: 1,
  padding: 1,
  paddingTop: 2,

  display: "flex",
  flexDirection: "column",

  ".SchemaPanel-header": {
    paddingLeft: 1,
  },

  ".SchemaPanel-dataGrid": {
    flexGrow: 1,
    width: 1,
    height: 1,
    overflow: "hidden",
  },

  ".MuiDataGrid-root": {
    border: "none",
    borderRadius: "0px",
  },

  ".MuiDataGrid-columnHeaders": {
    borderRadius: "0px",
  },
}

export interface SchemaPanelProps extends PanelProps {
  /** Connection rendered by this panel */
  connection: DataConnection
  /** Schema to be shown */
  schema?: DataSchema
}

//
// Shared panel with title and table
//

interface BaseSchemaPanelProps extends PanelProps {
  columns: GridColumns<any>
  rows: any[]
}

function BaseSchemaPanel(props: BaseSchemaPanelProps) {
  //
  // render
  //

  const className = "SchemaPanel-root" + (props.className ? " " + props.className : "")
  return (
    <Box className={className} sx={SchemaPanel_SxProps}>
      <Box className="SchemaPanel-header">
          <Typography className="SchemaPanel-title" variant="h6" sx={{ mr: 1 }}>
            {props.title}
          </Typography>
      </Box>
      <DataGrid
        className="SchemaPanel-dataGrid"
        rows={props.rows}
        columns={props.columns}
        onCommand={props.onCommand}
        dataGridProps={{
          autoHeight: false,
        }}
      />
    </Box>
  )
}

//
// TablesSchemaPanel
//

export interface TablesSchemaPanelProps extends SchemaPanelProps {
  /** Panel is used to show tables or views? */
  variant: "tables" | "views"
}

/** Shows list of tables (or views) available in given database */
export function TablesSchemaPanel(props: TablesSchemaPanelProps) {
  //
  // handlers
  //

  function handleCommand(event, command: Command) {
    console.log(`TablesSchemaPanel.handleCommand`, command)
    switch (command.command) {
      // use clicked on sql cell?
      case "dataGridCellDoubleClick":
        if (props.onCommand && command.args.field == "sql") {
          event.preventDefault()
          event.stopPropagation()
          const tableName = command.args.row.name
          props.onCommand(event, {
            command: "openQuery",
            args: {
              title: `Create ${tableName}`,
              connection: props.connection,
              database: props.schema?.database,
              sql: command.args.row.sql,
            },
          })
        }
        return

      case "dataGridRowDoubleClick":
        if (props.onCommand) {
          props.onCommand(event, {
            command: "openTable",
            args: {
              connection: props.connection,
              database: props.schema?.database,
              table: command.args.row.name,
            },
          })
        }
        return
    }
  }

  //
  // render
  //

  if (!props.schema) {
    return <>Loading...</>
  }

  /** Renders the same commands to view table structure or query its data as found in TreeViewItem */
  function renderRowCommands(params: GridRenderCellParams): ReactElement {
    const tableName = params.row.name
    const commands: (Command | "spacing")[] = []
    if (props.variant == "tables") {
      commands.push({
        command: "openTable",
        icon: "info",
        title: "View Structure",
        args: {
          connection: props.connection,
          database: props.schema?.database,
          table: tableName,
        },
      })
    }
    commands.push({
      command: "openQuery",
      title: "Query Data",
      icon: "query",
      args: {
        title: `All ${tableName}`,
        connection: props.connection,
        database: props.schema?.database,
        sql: `SELECT * FROM '${tableName}'`,
      },
    })

    return (
      <IconButtonGroup
        className="SchemaPanels-rowButtons"
        commands={commands}
        size="small"
        onCommand={props.onCommand}
      />
    )
  }

  const columns: GridColumns<any> = [
    {
      field: "name",
      headerName: "Name",
      description: `${props.variant == "tables" ? "Table" : "View"} name`,
      sortable: true,
      minWidth: 100,
      maxWidth: 240,
      flex: 3,
    },
    {
      field: "columns",
      headerName: "Columns",
      description: "Number of columns",
      type: "number",
      sortable: true,
      maxWidth: 100,
      flex: 1,
    },
    {
      field: "rows",
      headerName: "Rows",
      description: "Number of rows",
      type: "number",
      sortable: true,
      maxWidth: 100,
      flex: 1,
    },
    {
      field: "sql",
      headerName: "SQL",
      description: "SQL create statement",
      sortable: true,
      minWidth: 100,
      flex: 3,
    },
    {
      field: "commands",
      headerName: "",
      sortable: false,
      minWidth: 76, // 28px per IconButton
      maxWidth: 76,
      renderCell: renderRowCommands,
      align: "center",
    },
  ]

  const items = (props.variant == "tables" ? props.schema.tables : props.schema.views) || []
  const rows = items.map((table, id) => {
    return {
      id,
      name: table.name,
      columns: table.columns.length,
      rows: table.stats?.rows | 0,
      sql: table.sql,
    }
  })

  // TODO show specific empty state when schema has no tables or rows

  return (
    <BaseSchemaPanel
      title={props.variant == "tables" ? "Tables" : "Views"}
      rows={rows}
      columns={columns}
      onCommand={handleCommand}
    />
  )
}
