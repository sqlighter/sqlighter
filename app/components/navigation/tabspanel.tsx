//
// TabsPanel.tsx - a panel with a header section (title, description, commands, action) and a card with tabbed contents
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
import Query, { QueryRun } from "../../lib/items/query"

// components
import { Icon } from "../ui/icon"
import { IconButton } from "../ui/iconbutton"
import { IconButtonGroup } from "../ui/iconbuttongroup"
import { PanelProps, PanelElement } from "./panel"
import { Tabs } from "./tabs"
import { ConnectionPicker } from "../database/connectionpicker"
import { SqlEditor } from "../editor/sqleditor"
import { QueryRunPanel } from "../database/queryrunpanel"
import { useForceUpdate } from "../hooks/useforceupdate"
import { TitleField } from "../ui/titlefield"
import { Empty } from "../ui/empty"
import { Section } from "../ui/section"
import { DatabaseSchemaPanel } from "../panels/databaseschemapanel"

// styles applied to main and subcomponents
const TabsPanel_SxProps: SxProps<Theme> = {
  width: 1,
  minWidth: 360,
  height: 1,
  maxHeight: 1,

  paddingTop: 1.5,
  paddingLeft: 1,
  paddingRight: 1,
  paddingBottom: 1,

  ".TabsPanel-section": {
    height: 1
  },

  ".TabsPanel-card": {
    height: 1
  },
}

export interface TabsPanelProps extends PanelProps {
  /** Class applied to this component */
  className?: string

  /** Commands shown below header */
  commands: (Command | "divider" | "spacing")[]
  /** Large action button shown prominently in header */
  action?: Command

  /** Id of selected tab (controlled by parent) */
  tabId?: string
  /** Components to be used as tab panels (will use panel's id, icon, title for tabs) */
  tabs?: PanelElement[]
}

/** Panel used to edit and run database queries, show results  */
export function TabsPanel(props: TabsPanelProps) {
  //
  // state
  //

  // currently selected tab
  const [tabId, setTabId] = useState<string>("tab_schema")

  //
  // handlers
  //

  async function handleCommand(event: React.SyntheticEvent, command: Command) {
    console.debug(`TabsPanel.handleCommand - ${command.command}`, command)
    switch (command.command) {
      case "changedTabs":
        setTabId(command.args.id)
        return
    }

    if (props.onCommand) {
      props.onCommand(event, command)
    }
  }

  //
  // render
  //

  return (
    <Box className="TabsPanel-root" sx={TabsPanel_SxProps}>
      <Section
        className="TabsPanel-section"
        title={props.title}
        description={props.description}
        commands={props.commands}
        action={props.action}
        variant="large"
        onCommand={props.onCommand}
      >
        <Card className="TabsPanel-card" variant="outlined" square={true}>
          <Tabs className="TabsPanel-tabs" tabId={tabId} tabs={props.tabs} onCommand={handleCommand} variant="above" />
        </Card>
      </Section>
    </Box>
  )
}
