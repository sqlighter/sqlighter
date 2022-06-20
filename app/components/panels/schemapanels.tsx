//
// SchemaPanels.tsx - components to show schemas for tables, views, indexes and triggers
//

// libs
import React, { ReactElement } from "react"
import { Theme, SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { GridColumns, GridRenderCellParams } from "@mui/x-data-grid"

// model
import { Command } from "../../lib/commands"
import { DataConnection, DataSchema } from "../../lib/data/connections"

// components
import { DataGrid } from "../navigation/datagrid"
import { Empty } from "../ui/empty"
import { IconButtonGroup } from "../ui/iconbuttongroup"
import { PanelProps } from "../navigation/panel"

export const COLUMN_WIDTH_LARGE = 240
export const COLUMN_WIDTH_MEDIUM = 160
export const COLUMN_WIDTH_SMALL = 100
export const COLUMN_WIDTH_PER_COMMAND = 40 // a command icon is 28px

// styles shared between all components used to render schema elements
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
// SchemaPanelWithDataGrid - shared base component
//

export interface SchemaPanelWithDataGridProps extends SchemaPanelProps {
  /** Message to be shown if there are no columns or no rows */
  empty?: string
  /** Columns for data grid */
  columns?: GridColumns<any>
  /** Rows of data to be shown */
  rows?: any[]
}

export function SchemaPanelWithDataGrid(props: SchemaPanelWithDataGridProps) {
  //
  // handlers
  //

  function handleCommand(event, command: Command) {
    // console.debug(`SchemaPanelWithDataGrid.handleCommand`, command)
    console.assert(props.onCommand)

    switch (command.command) {
      // double clicked on sql cell? open query panel with create statement
      case "dataGridCellDoubleClick":
        if (command.args.field == "sql" && command.args.row.sql) {
          event.preventDefault()
          event.stopPropagation()
          const itemName = command.args.row.name || command.args.row.table
          props.onCommand(event, {
            command: "openQuery",
            args: {
              title: `Create ${itemName}`,
              connection: props.connection,
              database: props.schema?.database,
              sql: command.args.row.sql,
            },
          })
        }
        return

      // double clicked on a row? open related table
      case "dataGridRowDoubleClick":
        if (command.args.row.table) {
          props.onCommand(event, {
            command: "openTable",
            args: {
              connection: props.connection,
              database: props.schema?.database,
              table: command.args.row.table,
              select: props.title.toLowerCase(), // select table tab, eg. triggers, indexes, etc
            },
          })
          return
        }
        break
    }

    // pass to parent
    props.onCommand(event, command)
  }

  //
  // render
  //

  const className = "SchemaPanel-root" + (props.className ? " " + props.className : "")

  // is empty?
  if (!props.columns || props.rows?.length < 1) {
    return <Empty className={className} title={props.title} description={props.empty || "No data"} icon={props.icon} />
  }

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
        onCommand={handleCommand}
        dataGridProps={{
          autoHeight: false,
        }}
      />
    </Box>
  )
}

//
// TablesSchemaPanel - concrete use of SchemaPanelWithDataGrid
//

export interface TablesSchemaPanelProps extends SchemaPanelProps {
  /** Panel is used to show tables or views? */
  variant: "tables" | "views"
}

/** Shows list of tables (or views) available in given database */
export function TablesSchemaPanel(props: TablesSchemaPanelProps) {
  //
  // model
  //

  function getColumns(): GridColumns<any> {
    /** Renders the same commands to view table structure or query its data as found in TreeViewItem */
    function renderRowCommands(params: GridRenderCellParams): ReactElement {
      const tableName = params.row.table
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
        field: "table",
        headerName: "Name",
        description: `${props.variant == "tables" ? "Table" : "View"} name`,
        sortable: true,
        minWidth: COLUMN_WIDTH_MEDIUM,
        maxWidth: COLUMN_WIDTH_LARGE,
        flex: 3,
      },
      {
        field: "columns",
        headerName: "Columns",
        description: "Number of columns",
        type: "number",
        sortable: true,
        maxWidth: COLUMN_WIDTH_SMALL,
        flex: 1,
      },
      {
        field: "rows",
        headerName: "Rows",
        description: "Number of rows",
        type: "number",
        sortable: true,
        maxWidth: COLUMN_WIDTH_SMALL,
        flex: 1,
      },
      {
        field: "sql",
        headerName: "SQL",
        description: "SQL create statement",
        sortable: true,
        minWidth: COLUMN_WIDTH_MEDIUM,
        flex: 3,
      },
      {
        field: "commands",
        headerName: "",
        sortable: false,
        minWidth: COLUMN_WIDTH_PER_COMMAND * 2,
        maxWidth: COLUMN_WIDTH_PER_COMMAND * 2,
        renderCell: renderRowCommands,
        align: "center",
      },
    ]
    return columns
  }

  function getRows(): any[] {
    const items = (props.variant == "tables" ? props.schema.tables : props.schema.views) || []
    return items.map((table, id) => {
      return {
        id,
        table: table.name,
        columns: table.columns.length,
        rows: table.stats?.rows | 0,
        sql: table.sql,
      }
    })
  }

  //
  // render
  //

  const loaded = props.schema
  const columns = loaded && getColumns()
  const rows = loaded && getRows()
  return (
    <SchemaPanelWithDataGrid
      {...props}
      empty={loaded ? `This database has no ${props.variant.toLowerCase()}` : "Loading..."}
      rows={rows}
      columns={columns}
    />
  )
}

//
// IndexesSchemaPanel - concrete use of SchemaPanelWithDataGrid
//

export interface IndexesSchemaPanelProps extends SchemaPanelProps {
  /** Show only indexes in specific table? */
  table?: string
}

/** Shows list of indexes in given database or table */
export function IndexesSchemaPanel(props: IndexesSchemaPanelProps) {
  //
  // model
  //

  function getColumns(): GridColumns<any> {
    /** Renders the same commands to view table structure or query its data as found in TreeViewItem */
    function renderRowCommands(params: GridRenderCellParams): ReactElement {
      const indexName = params.row.name
      const commands: (Command | "spacing")[] = []
      if (params.row.sql) {
        commands.push({
          command: "openQuery",
          title: "View Sql",
          icon: "query",
          args: {
            title: `Create ${indexName}`,
            connection: props.connection,
            database: props.schema?.database,
            sql: params.row.sql,
          },
        })
      }
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
        description: `Index name`,
        sortable: true,
        minWidth: COLUMN_WIDTH_MEDIUM,
        maxWidth: COLUMN_WIDTH_LARGE,
        flex: 3,
      },
      {
        field: "table",
        headerName: "Table",
        description: "Table that is being indexed",
        sortable: true,
        minWidth: COLUMN_WIDTH_SMALL,
        maxWidth: COLUMN_WIDTH_MEDIUM,
        flex: 1,
      },
      {
        field: "columns",
        headerName: "Columns",
        description: "Column tables indexed",
        sortable: true,
        minWidth: COLUMN_WIDTH_MEDIUM,
        maxWidth: COLUMN_WIDTH_LARGE,
        flex: 1,
      },
      {
        field: "sql",
        headerName: "SQL",
        description: "SQL create statement",
        sortable: true,
        minWidth: COLUMN_WIDTH_SMALL,
        flex: 3,
      },
      {
        field: "commands",
        headerName: "",
        sortable: false,
        minWidth: COLUMN_WIDTH_PER_COMMAND,
        maxWidth: COLUMN_WIDTH_PER_COMMAND,
        renderCell: renderRowCommands,
        align: "center",
      },
    ]
    return columns
  }

  function getRows() {
    let indexes = props.schema?.indexes || []
    if (props.table) {
      indexes = indexes.filter((idx) => idx.table == props.table)
    }
    return indexes.map((idx, id) => {
      return {
        id,
        name: idx.name,
        table: idx.table,
        columns: idx.columns?.join(", "),
        sql: idx.sql,
      }
    })
  }

  //
  // render
  //

  const loaded = props.schema
  const columns = loaded && getColumns()
  const rows = loaded && getRows()
  return (
    <SchemaPanelWithDataGrid
      {...props}
      empty={loaded ? "This database has no indexes" : "Loading..."}
      rows={rows}
      columns={columns}
    />
  )
}

//
// TriggersSchemaPanel - concrete use of SchemaPanelWithDataGrid
//

export interface TriggersSchemaPanelProps extends SchemaPanelProps {
  /** Show only triggers in specific table? */
  table?: string
}

/** Shows list of indexes in given database or table */
export function TriggersSchemaPanel(props: IndexesSchemaPanelProps) {
  //
  // model
  //

  function getColumns(): GridColumns<any> {
    /** Renders the same commands to view table structure or query its data as found in TreeViewItem */
    function renderRowCommands(params: GridRenderCellParams): ReactElement {
      const indexName = params.row.name
      const commands: (Command | "spacing")[] = []
      if (params.row.sql) {
        commands.push({
          command: "openQuery",
          title: "View Sql",
          icon: "query",
          args: {
            title: `Create ${indexName}`,
            connection: props.connection,
            database: props.schema?.database,
            sql: params.row.sql,
          },
        })
      }
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
        description: `Trigger name`,
        sortable: true,
        minWidth: COLUMN_WIDTH_MEDIUM,
        maxWidth: COLUMN_WIDTH_LARGE,
        flex: 3,
      },
      {
        field: "table",
        headerName: "Table",
        description: "Table that this trigger works on",
        sortable: true,
        minWidth: COLUMN_WIDTH_SMALL,
        maxWidth: COLUMN_WIDTH_MEDIUM,
        flex: 1,
      },
      {
        field: "sql",
        headerName: "SQL",
        description: "SQL create statement",
        sortable: true,
        minWidth: COLUMN_WIDTH_SMALL,
        flex: 3,
      },
      {
        field: "commands",
        headerName: "",
        sortable: false,
        minWidth: COLUMN_WIDTH_PER_COMMAND,
        maxWidth: COLUMN_WIDTH_PER_COMMAND,
        renderCell: renderRowCommands,
        align: "center",
      },
    ]
    return columns
  }

  function getRows() {
    let indexes = props.schema?.indexes || []
    if (props.table) {
      indexes = indexes.filter((idx) => idx.table == props.table)
    }
    return indexes.map((idx, id) => {
      return {
        id,
        name: idx.name,
        table: idx.table,
        sql: idx.sql,
      }
    })
  }

  //
  // render
  //

  const loaded = props.schema
  const columns = loaded && getColumns()
  const rows = loaded && getRows()
  return (
    <SchemaPanelWithDataGrid
      {...props}
      empty={loaded ? "This database has no triggers" : "Loading..."}
      rows={rows}
      columns={columns}
    />
  )
}
