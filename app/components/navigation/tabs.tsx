//
// tabs.tsx - A tabbed panel used to switch between different editors or panels
// https://code.visualstudio.com/docs/getstarted/userinterface#_tabs
//

import { SyntheticEvent, useState } from "react"

import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import { SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import { IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/CloseOutlined"

import { Panel, PanelProps } from "./panel"

export const TABLIST_HEIGHT = 48

const TABLIST_STYLES: SxProps = {
  minHeight: TABLIST_HEIGHT,
  height: TABLIST_HEIGHT,

  borderBottom: (theme: any) => `1px solid ${theme.palette.divider}`,

  ".MuiTabs-flexContainer": {
    height: TABLIST_HEIGHT,
  },

  ".MuiTab-root": {
    minHeight: TABLIST_HEIGHT,
    height: TABLIST_HEIGHT,
    textTransform: "none",
    paddingRight: 1,

    ".MuiTab-closeIcon": {
      marginLeft: 1,
      color: "transparent",
    },

    "&:hover": {
      backgroundColor: "action.hover",
      ".MuiTab-closeIcon": {
        color: "text.secondary",
      },
    },
  },
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
  function handleTabsChange(e: SyntheticEvent<Element, Event>, tabId: string) {
    setTabId(tabId)
    if (props.onTabsChange) {
      props.onTabsChange(tabId, props.tabs)
    }
  }

  function handleCloseTab(e, tabId) {
    console.debug(`Tabs.handleCloseTab - tabId: ${tabId}`)
    e.stopPropagation()
  }

  //
  // render
  //

  return (
    <TabContext value={tabId}>
      <TabList onChange={handleTabsChange} variant="scrollable" sx={TABLIST_STYLES}>
        {props.tabs &&
          props.tabs.map((tab: any) => (
            <Tab
              key={tab.id}
              value={tab.id}
              icon={tab.icon}
              iconPosition="start"
              component="div"
              label={
                <span>
                  <Box component="span" sx={{ position: "relative", top: "1px" }}>
                    {tab.title}
                  </Box>
                  <IconButton onClick={(e) => handleCloseTab(e, tab.id)} className="MuiTab-closeIcon">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </span>
              }
            />
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
