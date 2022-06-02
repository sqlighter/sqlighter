//
// queryrunpanel.tsx - results from a query in tabular form, later charts, plugins, exports, etc...
//

// libs
import React from "react"
import Box from "@mui/material/Box"
import BottomNavigation from "@mui/material/BottomNavigation"
import BottomNavigationAction from "@mui/material/BottomNavigationAction"
import Typography from "@mui/material/Typography"
import capitalize from "@mui/material/utils/capitalize"

// model
import { DataConnection } from "../../lib/sqltr/connections"
import { QueryRun } from "../../lib/items/query"
import { formatSeconds } from "../client"
// view
import { ConnectionIcon } from "./connectionspicker"
import { Command } from "../../lib/commands"
import { DataGrid } from "./datagrid"
import { Icon } from "../ui/icon"
import { IconButton } from "../ui/iconbutton"
import { PanelProps } from "../navigation/panel"

export interface QueryRunPanelProps extends PanelProps {
  /** Database connection used to run this query */
  connection?: DataConnection

  /** Data model for query run shown in panel */
  run: QueryRun
}

/** Results of a query execution in tabular form, code, charts, etc. */
export function QueryRunPanel(props: QueryRunPanelProps) {
  const run = props.run

  //
  // state
  //

  const [value, setValue] = React.useState(0)

  //
  // handlers
  //

  function handleCommand(event, command: Command) {
    console.debug(`QueryRunPanel.handleCommand - command: ${command}`, command)
    if (props.onCommand) {
      props.onCommand(event, command)
    }
  }

  //
  // render
  //

  const command = {
    command: "print",
    icon: "database",
  }

  function renderStatus() {
    const status = capitalize(run.status)

    let titleColor = "text.primary"
    let secondaryText = null
    const elapsed = formatSeconds(run.createdAt, run.updatedAt)
    switch (run.status) {
      case "completed":
        titleColor = "success.main"
        if (run.values) {
          secondaryText = `${run.values?.[0]?.length} rows in ${elapsed}`
        } else {
          if (run.rowsModified !== undefined) {
            secondaryText = `${run.rowsModified} modified in ${elapsed}`
          }
        }
        break
      case "running":
        titleColor = "info.main"
        secondaryText = elapsed
        break
      case "error":
        titleColor = "error.main"
        break
    }

    return (
      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
        <ConnectionIcon connection={props.connection} />
        <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
          <Typography variant="body1" color={titleColor} sx={{position: "relative", top: "-2px"}}>
            {status}
          </Typography>
          {secondaryText && (
            <Typography variant="caption" color="text.secondary" sx={{position: "relative", top: "-6px"}}>
              {secondaryText}
            </Typography>
          )}
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ width: 1, height: 1, maxHeight: 1, display: "flex", flexDirection: "column" }}>
      <Box>
        <Box sx={{ display: "flex", m: 1 }}>
          <Box sx={{ flexGrow: 1 }}>{renderStatus()}</Box>
          <Box sx={{ flexGrow: 1 }}>
            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue)
              }}
              sx={{ width: 240 }}
            >
              <BottomNavigationAction label="SQL" icon={<Icon>database</Icon>} sx={{ width: 80 }} />
              <BottomNavigationAction label="Data" icon={<Icon>table</Icon>} />
              <BottomNavigationAction label="Charts" icon={<Icon>chart</Icon>} />
              <BottomNavigationAction label="Fullscreen" icon={<Icon>fullscreen</Icon>} />
              <BottomNavigationAction label="Export" icon={<Icon>export</Icon>} />
              <BottomNavigationAction label="Share" icon={<Icon>share</Icon>} />
              <BottomNavigationAction label="Search" icon={<Icon>search</Icon>} />
            </BottomNavigation>
          </Box>
          <Box>last</Box>
        </Box>
      </Box>
      <Box>second row</Box>

      <Box>id: {run.id}</Box>
      <Box>
        status: {run.status} <IconButton command={command} onCommand={handleCommand} />
      </Box>
      <Box>title: {run.query.title}</Box>
      {run.error && <Box>error: {run.error}</Box>}
      {run.rowsModified && <Box>rows modified: {run.rowsModified}</Box>}

      <Box sx={{ flexGrow: 1, height: 1, width: 1 }}>
        {run.columns && run.values && <DataGrid columns={run.columns} values={run.values} />}
      </Box>
    </Box>
  )
}
