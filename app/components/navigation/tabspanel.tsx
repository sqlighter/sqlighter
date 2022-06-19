//
// TabsPanel.tsx - a panel with a header section (title, description, commands, action) and a card with tabbed contents
//

// libs
import React, { useState } from "react"
import { Theme, SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"

// model
import { Command } from "../../lib/commands"

// components
import { PanelProps, PanelElement } from "./panel"
import { Tabs } from "./tabs"
import { Section } from "../ui/section"

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
  const [tabId, setTabId] = useState<string>(props.tabId)

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
          <Tabs className="TabsPanel-tabs" tabId={tabId} tabs={props.tabs} onCommand={handleCommand} variant="below" />
        </Card>
      </Section>
    </Box>
  )
}
