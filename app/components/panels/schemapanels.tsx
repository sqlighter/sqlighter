//
// SchemaPanels.tsx - components to show schemas for tables, views, indexes and triggers
//

// libs
import React, { ReactElement } from "react"
import { Theme, SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { GridColumns, GridRenderCellParams, GridInputSelectionModel } from "@mui/x-data-grid"

// model
import { Command } from "../../lib/commands"
import { DataConnection, DataSchema } from "../../lib/data/connections"

// components
import { Empty } from "../ui/empty"
import { Icon } from "../ui/icon"
import { IconButtonGroup } from "../ui/iconbuttongroup"
import { PanelProps } from "../navigation/panel"
import {
  DataGrid,
  COLUMN_WIDTH_SMALL,
  COLUMN_WIDTH_MEDIUM,
  COLUMN_WIDTH_LARGE,
  COLUMN_WIDTH_XXL,
  COLUMN_WIDTH_PER_COMMAND,
  COLUMN_FLEX_LARGE,
  COLUMN_FLEX_LARGEST,
} from "../navigation/datagrid"

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

  ".SchemaPanel-title": {
    marginRight: 1,
  },

  ".SchemaPanel-dataGrid": {
    flexGrow: 1,
    width: 1,
    height: 1,
    overflow: "hidden",
  },
}

export interface SchemaPanelProps extends PanelProps {
  /** Connection rendered by this panel */
  connection: DataConnection
  /** Schema to be shown */
  schema?: DataSchema
  /** An optional item that should be selected (initially) */
  selection?: string
}

//
// SchemaPanelWithDataGrid - shared base component
//

export interface SchemaPanelWithDataGridProps extends PanelProps {
  /** Connection rendered by this panel */
  connection: DataConnection
  /** Schema to be shown */
  schema?: DataSchema
  /** Message to be shown if there are no columns or no rows */
  empty?: string
  /** Columns for data grid */
  columns?: GridColumns<any>
  /** Rows of data to be shown */
  rows?: any[]
  /** Optional rows that should be selected (initially) */
  selection?: GridInputSelectionModel
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
        <Typography className="SchemaPanel-title" variant="h6">
          {props.title}
        </Typography>
      </Box>
      <DataGrid
        className="SchemaPanel-dataGrid"
        rows={props.rows}
        columns={props.columns}
        selection={props.selection}
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
        title: "Create Query",
        icon: "query",
        args: {
          title: `Create ${tableName}`,
          connection: props.connection,
          database: props.schema?.database,
          sql: params.row.sql,
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
        flex: COLUMN_FLEX_LARGEST,
      },
      {
        field: "columns",
        headerName: "Columns",
        description: "Number of columns",
        type: "number",
        sortable: true,
        maxWidth: COLUMN_WIDTH_SMALL,
        flex: COLUMN_FLEX_LARGE,
      },
      {
        field: "rows",
        headerName: "Rows",
        description: "Number of rows",
        type: "number",
        sortable: true,
        maxWidth: COLUMN_WIDTH_SMALL,
        flex: COLUMN_FLEX_LARGE,
      },
      {
        field: "sql",
        headerName: "SQL",
        description: "SQL create statement",
        sortable: true,
        minWidth: COLUMN_WIDTH_MEDIUM,
        flex: COLUMN_FLEX_LARGEST,
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
      className="TablesSchemaPanel-root"
      title={props.title}
      icon={props.icon}
      connection={props.connection}
      schema={props.schema}
      empty={loaded ? `This database has no ${props.variant.toLowerCase()}` : "Loading..."}
      rows={rows}
      columns={columns}
      selection={props.selection ? [props.selection] : undefined}
      onCommand={props.onCommand}
    />
  )
}

//
// IndexesSchemaPanel - concrete use of SchemaPanelWithDataGrid
//

export interface IndexesSchemaPanelProps extends SchemaPanelProps {
  /** Show only indexes in specific table? */
  table?: string
  /** Panel is used to show indexes in a database, table or view? */
  variant: "database" | "table" | "view"
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
        flex: COLUMN_FLEX_LARGEST,
      },
      {
        field: "table",
        headerName: "Table",
        description: "Table that is being indexed",
        sortable: true,
        minWidth: COLUMN_WIDTH_SMALL,
        maxWidth: COLUMN_WIDTH_MEDIUM,
        flex: COLUMN_FLEX_LARGE,
      },
      {
        field: "columns",
        headerName: "Columns",
        description: "Column tables indexed",
        sortable: true,
        minWidth: COLUMN_WIDTH_MEDIUM,
        maxWidth: COLUMN_WIDTH_LARGE,
        flex: COLUMN_FLEX_LARGE,
      },
      {
        field: "sql",
        headerName: "SQL",
        description: "SQL create statement",
        sortable: true,
        minWidth: COLUMN_WIDTH_SMALL,
        flex: COLUMN_FLEX_LARGEST,
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
        id: idx.name,
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
      className="IndexesSchemaPanel-root"
      title={props.title}
      icon={props.icon}
      connection={props.connection}
      schema={props.schema}
      empty={loaded ? `This ${props.variant} has no indexes` : "Loading..."}
      rows={rows}
      columns={columns}
      selection={props.selection ? [props.selection] : undefined}
      onCommand={props.onCommand}
    />
  )
}

//
// TriggersSchemaPanel - concrete use of SchemaPanelWithDataGrid
//

export interface TriggersSchemaPanelProps extends SchemaPanelProps {
  /** Show only triggers in specific table? */
  table?: string
  /** Panel is used to show triggers in a database, table or view? */
  variant: "database" | "table" | "view"
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
        flex: COLUMN_FLEX_LARGEST,
      },
      {
        field: "table",
        headerName: "Table",
        description: "Table that this trigger works on",
        sortable: true,
        minWidth: COLUMN_WIDTH_SMALL,
        maxWidth: COLUMN_WIDTH_MEDIUM,
        flex: COLUMN_FLEX_LARGE,
      },
      {
        field: "sql",
        headerName: "SQL",
        description: "SQL create statement",
        sortable: true,
        minWidth: COLUMN_WIDTH_SMALL,
        flex: COLUMN_FLEX_LARGEST,
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
    let triggers = props.schema?.triggers || []
    if (props.table) {
      triggers = triggers.filter((trg) => trg.table == props.table)
    }
    return triggers.map((trg) => {
      return {
        id: trg.name,
        name: trg.name,
        table: trg.table,
        sql: trg.sql,
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
      className="TriggersSchemaPanel-root"
      title={props.title}
      icon={props.icon}
      connection={props.connection}
      schema={props.schema}
      empty={loaded ? `This ${props.variant} has no triggers` : "Loading..."}
      rows={rows}
      columns={columns}
      selection={props.selection ? [props.selection] : undefined}
      onCommand={props.onCommand}
    />
  )
}

//
// ColumnsSchemaPanel - concrete use of SchemaPanelWithDataGrid
//

export interface ColumnsSchemaPanelProps extends SchemaPanelProps {
  /** Show columns in this table */
  table: string
  /** Panel is used to show tables or views? */
  variant: "table" | "view"
}

/** Shows list of columns in a table or view */
export function ColumnsSchemaPanel(props: ColumnsSchemaPanelProps) {
  //
  // state
  //

  let tableSchema
  if (props.schema) {
    tableSchema =
      props.variant == "view"
        ? props.schema.views?.find((v) => v.name.toLowerCase() == props.table.toLowerCase())
        : props.schema.tables.find((t) => t.name.toLowerCase() == props.table.toLowerCase())
  }

  //
  // model
  //

  function getColumns(): GridColumns<any> {
    /** Renders the same commands to view table structure or query its data as found in TreeViewItem */
    function renderRowCommands(params: GridRenderCellParams): ReactElement {
      const commands: (Command | "spacing")[] = [
        {
          command: "openQuery",
          title: "View Sql",
          icon: "query",
          args: {
            title: `Column ${params.row.name}`,
            connection: props.connection,
            database: props.schema?.database,
            sql: `SELECT * FROM pragma_table_info('${props.table}') WHERE name = '${params.row.name}'`,
          },
        },
      ]
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
        field: "primaryKey",
        headerName: "Primary",
        description: `Primary Key`,
        sortable: true,
        minWidth: COLUMN_WIDTH_SMALL,
        maxWidth: COLUMN_WIDTH_SMALL,
        align: "left",
        renderCell: (params: GridRenderCellParams) => {
          return params.row.primaryKey ? <Icon color="action">key</Icon> : <></>
        },
      },
      {
        field: "name",
        headerName: "Name",
        description: `Column name`,
        sortable: true,
        minWidth: COLUMN_WIDTH_MEDIUM,
        maxWidth: COLUMN_WIDTH_XXL,
        flex: COLUMN_FLEX_LARGEST,
      },
      {
        field: "datatype",
        headerName: "Type",
        description: "Data type",
        sortable: true,
        minWidth: COLUMN_WIDTH_MEDIUM,
        maxWidth: COLUMN_WIDTH_XXL,
        flex: COLUMN_FLEX_LARGE,
      },
      {
        field: "notNull",
        headerName: "Nullable",
        description: "Column can be null?",
        sortable: true,
        minWidth: COLUMN_WIDTH_SMALL,
        maxWidth: COLUMN_WIDTH_SMALL,
        headerAlign: "center",
        align: "center",
        renderCell: (params: GridRenderCellParams) => {
          return params.row.notNull ? <></> : <Icon color="action">check</Icon>
        },
      },
      {
        field: "default",
        headerName: "Default",
        description: "Default value",
        sortable: true,
        minWidth: COLUMN_WIDTH_MEDIUM,
        maxWidth: COLUMN_WIDTH_XXL,
        flex: COLUMN_FLEX_LARGE,
        renderCell: (params: GridRenderCellParams) => {
          if (params.row.default) {
            return params.row.default
          }
          return params.row.notNull ? <></> : <Typography color="text.secondary">(null)</Typography>
        },
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
    return (
      tableSchema?.columns &&
      tableSchema.columns.map((col) => {
        return { id: col.name, ...col }
      })
    )
  }

  //
  // render
  //

  const loaded = props.schema
  const columns = loaded && getColumns()
  const rows = loaded && getRows()
  return (
    <SchemaPanelWithDataGrid
      className="ColumnsSchemaPanel-root"
      title={props.title}
      icon={props.icon}
      connection={props.connection}
      schema={props.schema}
      empty={loaded ? `This ${props.variant} has no columns` : "Loading..."}
      rows={rows}
      columns={columns}
      selection={props.selection ? [props.selection] : undefined}
      onCommand={props.onCommand}
    />
  )
}

//
// RelationsSchemaPanel - concrete use of SchemaPanelWithDataGrid
//

export interface RelationsSchemaPanelProps extends SchemaPanelProps {
  /** Show foreign keys in this table */
  table: string
  /** Panel is used to show tables or views? */
  variant: "table" | "view"
}

/** Shows list of foreign keys in a table or view */
export function RelationsSchemaPanel(props: RelationsSchemaPanelProps) {
  //
  // state
  //

  let tableSchema
  if (props.schema) {
    tableSchema =
      props.variant == "view"
        ? props.schema.views?.find((v) => v.name.toLowerCase() == props.table.toLowerCase())
        : props.schema.tables.find((t) => t.name.toLowerCase() == props.table.toLowerCase())
  }

  //
  // model
  //

  function getColumns(): GridColumns<any> {
    /** Renders the same commands to view table structure or query its data as found in TreeViewItem */
    function renderRowCommands(params: GridRenderCellParams): ReactElement {
      const commands: (Command | "spacing")[] = [
        {
          command: "openQuery",
          title: "View Sql",
          icon: "query",
          args: {
            title: `Foreign key on ${params.row.fromColumn}`,
            connection: props.connection,
            database: props.schema?.database,
            sql: `SELECT * FROM pragma_foreign_key_list("${props.table}") WHERE "from" = "${params.row.fromColumn}"`,
          },
        },
      ]
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
        // just a static key icon for visuals only
        field: "name",
        headerName: "Fk",
        description: "Foreign Key",
        minWidth: COLUMN_WIDTH_PER_COMMAND,
        maxWidth: COLUMN_WIDTH_PER_COMMAND,
        sortable: false,
        align: "left",
        renderCell: () => <Icon color="action">foreignKey</Icon>,
      },
      {
        field: "fromColumn",
        headerName: "From Column",
        description: `Column in this ${props.variant} that has a foreign key reference`,
        sortable: true,
        minWidth: COLUMN_WIDTH_MEDIUM,
        maxWidth: COLUMN_WIDTH_LARGE,
        flex: COLUMN_FLEX_LARGE,
      },
      {
        field: "toColumn",
        headerName: "To Column",
        description: "Column referenced by foreign key",
        sortable: true,
        minWidth: COLUMN_WIDTH_MEDIUM,
        maxWidth: COLUMN_WIDTH_LARGE,
        flex: COLUMN_FLEX_LARGE,
      },
      {
        field: "table",
        headerName: "On Table",
        description: "Table referenced by foreign key",
        sortable: true,
        minWidth: COLUMN_WIDTH_MEDIUM,
        maxWidth: COLUMN_WIDTH_LARGE,
        flex: COLUMN_FLEX_LARGE,
      },
      {
        field: "onUpdate",
        headerName: "On Update",
        description: "Effect when referenced key is updated",
        sortable: true,
        minWidth: COLUMN_WIDTH_MEDIUM,
        maxWidth: COLUMN_WIDTH_LARGE,
        flex: COLUMN_FLEX_LARGE,
      },
      {
        field: "onDelete",
        headerName: "On Delete",
        description: "Effect when referenced key is deleted",
        sortable: true,
        minWidth: COLUMN_WIDTH_MEDIUM,
        maxWidth: COLUMN_WIDTH_LARGE,
        flex: COLUMN_FLEX_LARGE,
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
    const foreignKeys = tableSchema?.foreignKeys || []
    return foreignKeys.map((fk, id) => {
      return { id, ...fk }
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
      className="RelationsSchemaPanel-root"
      title={props.title}
      icon={props.icon}
      connection={props.connection}
      schema={props.schema}
      empty={loaded ? `This ${props.variant} has no foreign keys` : "Loading..."}
      rows={rows}
      columns={columns}
      onCommand={props.onCommand}
    />
  )
}
