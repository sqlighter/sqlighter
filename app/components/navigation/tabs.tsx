//
// tabs.tsx - A tabbed panel used to switch between different editors or panels
// https://code.visualstudio.com/docs/getstarted/userinterface#_tabs
//

import { useState } from "react"

import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import { Theme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import Box from "@mui/material/Box"

import { Panel, PanelProps } from "./panel"

const TABLIST_STYLES = {
  height: 48,
}

interface TabsProps extends PanelProps {
  /** List of tab panels to be shown (includes title, contents, etc) */
  tabs?: PanelProps[]

  /** Called when a tab is selected, a tab is closed, tabs order changes, etc. */
  onTabsChange?: (tabId?: string, tabs?: PanelProps[]) => void
}

/** A tabbed panel used to switch between different editors or panels */
export function Tabs(props: TabsProps) {
  // currently selected tab
  const [tabId, setTabId] = useState(props.tabs[0].id)

  //
  // handlers
  //

  /** Handle change in selected tab */
  function handleTabsChange(_, tabId) {
    setTabId(tabId)
    if (props.onTabsChange) {
      props.onTabsChange(tabId, props.tabs)
    }
  }

  //
  // render
  //

  return (
    <TabContext value={tabId}>
      <TabList onChange={handleTabsChange} variant="scrollable" sx={TABLIST_STYLES}>
        {props.tabs &&
          props.tabs.map((tab: any) => (
            <Tab key={tab.id} label={tab.title} value={tab.id} icon={tab.icon} iconPosition="start" />
          ))}
      </TabList>
      {props.tabs &&
        props.tabs.map((tab: any) => (
          <TabPanel key={tab.id} id={tab.id} value={tab.id} sx={{ padding: 0, width: "100%", height: "100%" }}>
            <Panel {...tab} />
          </TabPanel>
        ))}
    </TabContext>
  )
}
