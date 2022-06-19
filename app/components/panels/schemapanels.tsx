//
// SchemaPanels.tsx - components to show schemas for tables, views, indexes, etc
//

// libs
import React, { ReactElement } from "react"
import { Theme, SxProps } from "@mui/material"
import Badge from "@mui/material/Badge"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { DataGrid, GridCellParams, GridRenderCellParams } from "@mui/x-data-grid"

// model
import { Command } from "../../lib/commands"
import { DataConnection, DataSchema } from "../../lib/data/connections"

// components
import { IconButtonGroup } from "../ui/iconbuttongroup"
import { PanelProps } from "../navigation/panel"

// styles applied to main and subcomponents
const SchemaPanel_SxProps: SxProps<Theme> = {
  width: 1,
  height: 1,

  padding: 1,
  paddingTop: 2,

  ".SchemaPanel-gridBox": {
    marginLeft: -1,
    marginRight: -1,
  },

  ".MuiDataGrid-root": {
    border: "none",
    borderRadius: "0px",
  },

  ".MuiDataGrid-columnHeaders": {
    borderRadius: "0px"
  }
}

export interface SchemaPanelProps extends PanelProps {
  /** Connection rendered by this panel */
  connection: DataConnection
  /** Schema to be shown */
  schema?: DataSchema
}

//
// TablesSchemaPanel
//

/** Shows list of tables available in given database */
export function TablesSchemaPanel(props: SchemaPanelProps) {
  //
  // handlers
  //

  /** Open table panel when row is double clicked or command icon clicked */
  function handleOpenTable(event, tableName: string) {
    // console.debug(`handleOpenTable - tableName: ${tableName}`)
    if (props.onCommand) {
      props.onCommand(event, {
        command: "openTable",
        args: {
          connection: props.connection,
          database: props.schema?.database,
          table: tableName,
        },
      })
    }
  }

  /** If user double clicks on sql statement a query will open with that statement */
  function handleSqlCellDoubleClick(params: GridCellParams, event) {
    // other cells will pass through to onRowDoubleClick
    if (params.field == "sql") {
      event.preventDefault()
      event.stopPropagation()

      const tableName = params.row.name
      props.onCommand(event, {
        command: "openQuery",
        args: {
          title: `Create ${tableName}`,
          connection: props.connection,
          database: props.schema?.database,
          sql: params.row.sql,
        },
      })
    }
  }

  //
  // render
  //

  /** Renders the same commands to view table structure or query its data as found in TreeViewItem */
  function renderRowCommands(params: GridRenderCellParams): ReactElement {
    const tableName = params.row.name
    const commands: (Command | "spacing")[] = [
      {
        command: "openTable",
        icon: "info",
        title: "View Structure",
        args: {
          connection: props.connection,
          database: props.schema?.database,
          table: tableName,
        },
      },
      {
        command: "openQuery",
        title: "Query Data",
        icon: "query",
        args: {
          title: `All ${tableName}`,
          connection: props.connection,
          database: props.schema?.database,
          sql: `SELECT * FROM '${tableName}'`,
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

  function renderTables() {
    const columns = [
      {
        field: "name",
        headerName: "Name",
        description: "Table name",
        sortable: true,
        minWidth: 100,
        maxWidth: 240,
        flex: 3,
      },
      {
        field: "columns",
        headerName: "Columns",
        description: "Number of columns in the table",
        type: "number",
        sortable: true,
        maxWidth: 100,
        flex: 1,
      },
      {
        field: "rows",
        headerName: "Rows",
        description: "Number of rows in the table",
        type: "number",
        sortable: true,
        maxWidth: 100,
        flex: 1,
      },
      {
        field: "sql",
        headerName: "SQL",
        description: "SQL create statement for this table",
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
        // align: "center",
      },
    ]

    const rows = props.schema.tables.map((table, id) => {
      return {
        id,
        name: table.name,
        columns: table.columns.length,
        rows: table.stats?.rows | 0,
        sql: table.sql,
      }
    })

    return (
      <Stack sx={SchemaPanel_SxProps}>
        <Box>
          <Badge badgeContent={props.schema?.tables?.length} color="primary">
            <Typography className="SchemaPanel-title" variant="h6" sx={{ mr: 1 }}>
              Tables
            </Typography>
          </Badge>
        </Box>
        <Box className="SchemaPanel-gridBox">
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            hideFooter
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            onCellDoubleClick={handleSqlCellDoubleClick}
            onRowDoubleClick={(params, event) => handleOpenTable(event, params.row.name)}
          />
        </Box>
      </Stack>
    )
  }

  return (
    <Box className="SchemaPanel-root TablesSchemaPanel-root" sx={SchemaPanel_SxProps}>
      {props.schema && renderTables()}
    </Box>
  )
}
