//
// tabs.tsx - A tabbed panel used to switch between different editors or panels
// https://code.visualstudio.com/docs/getstarted/userinterface#_tabs
//

import React, { SyntheticEvent, useState, Children, ReactElement } from "react"

import Box from "@mui/material/Box"
import { SxProps } from "@mui/material"
import { IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/CloseOutlined"
import MuiTab from "@mui/material/Tab"
import MuiTabContext from "@mui/lab/TabContext"
import MuiTabList from "@mui/lab/TabList"
import MuiTabPanel from "@mui/lab/TabPanel"

import { Command, CommandEvent } from "../../lib/commands"
import { Icon } from "../ui/icon"
import { Panel, PanelProps, PanelElement } from "./panel"

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
  /** Id of selected tab (controlled by parent) */
  tabId?: string

  /** Components to be used as tab panels (will use panel's id, icon, title for tabs) */
  tabs?: PanelElement[]

  /** Additional command icons shown at the end of the tab bar, eg: create tab icon */
  tabsCommands?: Command[]

  /** Will dispatch a command when a new tab is selected or when tabs are closed, reordered */
  onCommand?: CommandEvent
}

/** A tabbed panel used to switch between different editors or panels */
export function Tabs(props: TabsProps) {
  //
  // handlers
  //

  /** Handle change in selected tab */
  function handleTabsChange(event: SyntheticEvent<Element, Event>, tabId: string) {
    if (props.onCommand) {
      props.onCommand(event, {
        command: "tabs.changeTabs",
        args: {
          tabId, // newly selected tab
          tabs: props.tabs, // same list of tabs/children as before
        },
      })
    }
  }

  /** When a tab is closed we remove it from the list of tabs (and select a new one if needed) */
  function handleCloseTab(event, closedTabId) {
    // console.debug(`Tabs.handleCloseTab - closedTabId: ${closedTabId}`)
    event.stopPropagation()

    // create new list of tabs without the tab that was just closed
    if (props.onCommand) {
      // notify parent that tab is being closed
      props.onCommand(event, {
        command: "tabs.closeTab",
        args: {
          tabId: closedTabId,
        },
      })

      // filter closed tab out of children list and notify parent with new list of tabs/children
      const updatedTabs = props.tabs && props.tabs.filter((tab) => tab.props.id !== closedTabId)
      const updatedId =
        props.tabId == closedTabId ? (updatedTabs.length > 0 ? updatedTabs[0].props.id : null) : props.tabId
      props.onCommand(event, {
        command: "tabs.changeTabs",
        args: {
          tabId: updatedId,
          tabs: updatedTabs,
        },
      })
    }
  }

  /** Tab is starting to be dragged to a new position */
  function handleTabDragStart(e) {
    const draggedTabId = e.target.getAttribute("aria-label")
    const draggedTabIndex = props.tabs.findIndex((tab) => tab.props.id == draggedTabId)
    e.dataTransfer.setData("tabId", draggedTabId)
    e.dataTransfer.setData("tabIndex", draggedTabIndex)
    console.debug(`Tabs.handleTabDragStart - dragging tab: ${draggedTabId}, fromIndex: ${draggedTabIndex}`)
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

  /** Rearrange tabs and notify parent when a tab is dropped in a new position */
  function handleTabDrop(event) {
    event.preventDefault()

    const tabList = event.target.closest("div[role='tablist']") as HTMLElement
    if (!tabList) {
      return
    }

    const draggedTabId = event.dataTransfer.getData("tabId")
    const fromIndex = event.dataTransfer.getData("tabIndex")
    const toIndex = getTabDropIndex(event)
    console.debug(`Tabs.handleTabDrop - moving ${draggedTabId}, fromIndex: ${fromIndex}, toIndex: ${toIndex}`)

    if (fromIndex != toIndex && props.onCommand) {
      const updatedTabs = [...props.tabs]
      if (toIndex > fromIndex) {
        // moving right, insert in new position, remove from old
        updatedTabs.splice(toIndex, 0, props.tabs[fromIndex])
        updatedTabs.splice(fromIndex, 1)
      } else {
        // moving left, remove from old position, insert new
        updatedTabs.splice(fromIndex, 1)
        updatedTabs.splice(toIndex, 0, props.tabs[fromIndex])
      }

      // select dragged tab, notify parent of reordering
      console.debug(`Tabs.handleTabDrop - moving ${draggedTabId}, fromIndex: ${fromIndex}, toIndex: ${toIndex}`)
      if (props.onCommand) {
        props.onCommand(event, {
          command: "tabs.changeTabs",
          args: {
            tabId: draggedTabId,
            tabs: updatedTabs,
          },
        })
      }
    }
  }

  //
  // render
  //

  function renderCommands() {
    if (props.tabsCommands) {
      return props.tabsCommands.map((command) => {
        return (
          <Box className="MuiTab-addIcon">
            <IconButton onClick={(e) => props.onCommand(e, command)}>
              <Icon fontSize="small">{command.icon}</Icon>
            </IconButton>
          </Box>
        )
      })
    }
    return null
  }

  // TODO render all panels and hide them with css so that tab's state is not lost when moving between tabs
  function renderPanels() {
    return (
      props.tabs &&
      props.tabs.map((child: any) => (
        <MuiTabPanel
          key={child.props.id}
          value={child.props.id}
          sx={{
            padding: 0,
            backgroundColor: "azure",
            height: 1,
            maxHeight: 1,
            overflow: "scroll",
          }}
        >
          {child}
        </MuiTabPanel>
      ))
    )
  }

  return (
    <MuiTabContext value={props.tabId}>
      <Box sx={{ display: "flex", flexDirection: "column", height: 1, maxHeight: 1 }}>
        <Box sx={{ height: TABLIST_HEIGHT }}>
          <MuiTabList onChange={handleTabsChange} variant="scrollable" sx={TABLIST_STYLES}>
            {props.tabs &&
              props.tabs.map((tab: any) => {
                const tabProps = tab.props
                return (
                  <MuiTab
                    key={tabProps.id}
                    id={tabProps.id}
                    value={tabProps.id}
                    icon={typeof tabProps.icon === "string" ? <Icon>{tabProps.icon}</Icon> : tabProps.icon}
                    aria-label={tabProps.id}
                    iconPosition="start"
                    component="div"
                    label={
                      <span>
                        <Box component="span" className="MuiTab-textLabel">
                          {tabProps.title}
                        </Box>
                        <IconButton onClick={(e) => handleCloseTab(e, tabProps.id)} className="MuiTab-closeIcon">
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </span>
                    }
                    draggable="true"
                    onDragStart={handleTabDragStart}
                    onDragOver={handleTagDragOver}
                    onDrop={handleTabDrop}
                  />
                )
              })}
            {renderCommands()}
          </MuiTabList>
        </Box>
        {renderPanels()}
      </Box>
    </MuiTabContext>
  )
}
