//
// tabs.tsx - A tabbed panel used to switch between different editors or panels
// https://code.visualstudio.com/docs/getstarted/userinterface#_tabs
//

import { SyntheticEvent, useState } from "react"

import Box from "@mui/material/Box"
import { SxProps } from "@mui/material"
import { IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/AddOutlined"
import CloseIcon from "@mui/icons-material/CloseOutlined"

import MuiTab from "@mui/material/Tab"
import MuiTabContext from "@mui/lab/TabContext"
import MuiTabList from "@mui/lab/TabList"
import MuiTabPanel from "@mui/lab/TabPanel"

import { CommandEvent } from "../../lib/commands"
import { Icon } from "../ui/icon"
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

    ".MuiTab-textLabel": {
      position: "relative",
      top: "1px",
    },

    // TODO keep close icons visible on touch devices
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

  ".MuiTab-addIcon": {
    display: "flex",
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 1,

    ".MuiIconButton-root": {
      color: "text.secondary",
    },
  },
}

export interface TabsProps {
  /** Id of selected tab */
  tabId?: string

  /** List of tab panels to be shown (includes id, title, children, etc) */
  tabs?: PanelProps[]

  /** Called when a tab is selected, a tab is closed, tabs order changes, etc. */
  onTabsChange?: (tabId?: string, tabs?: PanelProps[]) => void

  /** Called when add button is clicked (will not show button if handler undefined) */
  onAddTabClick?: (e: React.MouseEvent<HTMLButtonElement>) => void

  /** Will dispatch a command when a new tab is selected or when tabs are closed, reordered */
  onCommand?: CommandEvent
}

/** A tabbed panel used to switch between different editors or panels */
export function Tabs(props: TabsProps) {
  //
  // state
  //

  //
  // handlers
  //

  /** Handle change in selected tab */
  function handleTabsChange(event: SyntheticEvent<Element, Event>, tabId: string) {
    if (props.onCommand) {
      props.onCommand(event, {
        command: "tabs.changeTabs",
        args: {
          tabId,
          tabs: props.tabs,
        },
      })
    }
  }

  /** When a tab is closed we remove it from the list of tabs (and select a new one if needed) */
  function handleCloseTab(event, closedTabId) {
    // console.debug(`Tabs.handleCloseTab - closedTabId: ${closedTabId}`)
    event.stopPropagation()

    // create new list of tabs without the tab that was just closed
    console.assert(props.tabs)
    if (props.onCommand) {
      props.onCommand(event, {
        command: "tabs.closeTab",
        args: {
          tabId: closedTabId,
        },
      })

      // newly selected tab
      const tabs = props.tabs.filter((tab) => tab.id !== closedTabId)
      const tabId = props.tabId == closedTabId ? (tabs.length > 0 ? tabs[0].id : null) : props.tabId
      props.onCommand(event, {
        command: "tabs.changeTabs",
        args: {
          tabId,
          tabs,
        },
      })
    }
  }

  /** Tab is starting to be dragged to a new position */
  function handleTabDragStart(e) {
    const draggedTabId = e.target.getAttribute("aria-label")
    const draggedTabIndex = props.tabs.findIndex((tab) => tab.id == draggedTabId)
    e.dataTransfer.setData("tabId", draggedTabId)
    e.dataTransfer.setData("tabIndex", draggedTabIndex)
    // console.debug(`Tabs.handleTabDragStart - dragging tab: ${draggedTabId}, fromIndex: ${draggedTabIndex}`)
  }

  /** Returns index where tab being dragged should be dropped to based on mouse position */
  function getTabDropIndex(e): number {
    const tabList = e.target.closest("div[role='tablist']") as HTMLElement
    if (tabList) {
      // position in tab list where the tab should be dropped to
      let toIndex = 0
      for (let i = 0; i < tabList.childNodes.length; i++) {
        const childTab = tabList.childNodes[i] as HTMLElement
        const childTabRect = childTab.getBoundingClientRect()
        const childTabMiddle = childTabRect.left + childTabRect.width / 2
        if (e.pageX > childTabMiddle) {
          toIndex = i + 1
        }
      }
      return toIndex
    }
    return -1
  }

  function handleTagDragOver(e) {
    e.preventDefault()
  }

  function handleTabDrop(event) {
    event.preventDefault()

    const tabList = event.target.closest("div[role='tablist']") as HTMLElement
    if (!tabList) {
      return
    }

    const draggedTabId = event.dataTransfer.getData("tabId")
    const fromIndex = event.dataTransfer.getData("tabIndex")
    const toIndex = getTabDropIndex(event)
    if (fromIndex != toIndex && props.onTabsChange) {
      const tabs = [...props.tabs]
      if (toIndex > fromIndex) {
        // moving right, insert in new position, remove from old
        tabs.splice(toIndex, 0, props.tabs[fromIndex])
        tabs.splice(fromIndex, 1)
      } else {
        // moving left, remove from old position, insert new
        tabs.splice(fromIndex, 1)
        tabs.splice(toIndex, 0, props.tabs[fromIndex])
      }

      // select dragged tab, notify parent of reordering
      console.debug(`Tabs.handleTabDrop - moving ${draggedTabId}, fromIndex: ${fromIndex}, toIndex: ${toIndex}`)

      props.onCommand(event, {
        command: "tabs.changeTabs",
        args: {
          tabId: draggedTabId,
          tabs,
        },
      })
    }
  }

  function handleAddTab(e) {
    console.debug("Tabs.handleAddTab")
  }

  //
  // render
  //

  if (props.tabs?.length > 0) {
    console.debug(`renderingTabs - tab[0]`, props.tabs[0].children, props.tabs[0].children?.props)
  }

  return (
    <MuiTabContext value={props.tabId}>
      <Box sx={{ display: "flex", flexDirection: "column", height: 1, maxHeight: 1 }}>
        <Box sx={{ height: TABLIST_HEIGHT }}>
          <MuiTabList onChange={handleTabsChange} variant="scrollable" sx={TABLIST_STYLES}>
            {props.tabs &&
              props.tabs.map((tab: any) => (
                <MuiTab
                  key={tab.id}
                  id={"ciccio" + tab.id}
                  value={tab.id}
                  icon={typeof tab.icon === "string" ? <Icon>{tab.icon}</Icon> : tab.icon}
                  aria-label={tab.id}
                  iconPosition="start"
                  component="div"
                  label={
                    <span>
                      <Box component="span" className="MuiTab-textLabel">
                        {tab.title}
                      </Box>
                      <IconButton onClick={(e) => handleCloseTab(e, tab.id)} className="MuiTab-closeIcon">
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </span>
                  }
                  draggable="true"
                  onDragStart={handleTabDragStart}
                  onDragOver={handleTagDragOver}
                  onDrop={handleTabDrop}
                />
              ))}
            {props.onAddTabClick && (
              <Box className="MuiTab-addIcon">
                <IconButton onClick={props.onAddTabClick}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </MuiTabList>
        </Box>
        {props.tabs &&
          props.tabs.map((tab: any) => (
            <MuiTabPanel
              key={tab.id}
              value={tab.id}
              sx={{
                padding: 0,
                backgroundColor: "azure",
                height: 1,
                maxHeight: 1,
                overflow: "scroll",
              }}
            >
              {tab.children}
            </MuiTabPanel>
          ))}
      </Box>
    </MuiTabContext>
  )
}
