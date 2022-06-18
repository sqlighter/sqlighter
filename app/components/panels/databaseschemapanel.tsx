//
// DatabaseSchemaPanel.tsx - shows tables, indexes, etc used as a tab in <DatabasePanel>
//

// libs
import React from "react"
import { useState } from "react"
import { Theme, SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import Stack from "@mui/material/Stack"

// model
import { Command } from "../../lib/commands"
import { DataConnection } from "../../lib/data/connections"

// components
import { Icon } from "../ui/icon"
import { IconButton } from "../ui/iconbutton"
import { IconButtonGroup } from "../ui/iconbuttongroup"
import { PanelProps } from "../navigation/panel"
import { Tabs } from "../navigation/tabs"
import { Empty } from "../ui/empty"
import { Section } from "../ui/section"

// styles applied to main and subcomponents
const DatabaseSchemaPanel_SxProps: SxProps<Theme> = {
  width: 1,
  minWidth: 360,
  height: 1,
  maxHeight: 1,

  paddingTop: 1.5,
  paddingLeft: 1,
  paddingRight: 1,
  paddingBottom: 1,
}

export interface DatabaseSchemaPanelProps extends PanelProps {
  /** Connection rendered by this panel */
  connection: DataConnection
}

/** Panel used to edit and run database queries, show results  */
export function DatabaseSchemaPanel(props: DatabaseSchemaPanelProps) {
  const { connection, onCommand } = props

  //
  // render
  //

  return (
    <Box className="DatabaseSchemaPanel-root" sx={DatabaseSchemaPanel_SxProps}>
      The schema of the database goes here
    </Box>
  )
}

