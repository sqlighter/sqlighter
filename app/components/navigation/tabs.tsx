//
// tabs.tsx - A tabbed panel used to switch between different editors or panels
// https://code.visualstudio.com/docs/getstarted/userinterface#_tabs
//

import React, { SyntheticEvent, ReactElement } from "react"
import Box from "@mui/material/Box"
import { SxProps, Theme } from "@mui/material"
import MuiTab from "@mui/material/Tab"
import MuiTabContext from "@mui/lab/TabContext"
import MuiTabList from "@mui/lab/TabList"
import MuiTabPanel from "@mui/lab/TabPanel"
import Typography from "@mui/material/Typography"

import { Command, CommandEvent } from "../../lib/commands"
import { Icon } from "../ui/icon"
import { PanelElement } from "./panel"
import { IconButton } from "../ui/iconbutton"

export const TABLIST_HEIGHT = 48

const Tabs_SxProps: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  height: 1,
  maxHeight: 1,

  ".Tabs-tabList": {
    minHeight: TABLIST_HEIGHT,
    height: TABLIST_HEIGHT,
    display: "flex",

    backgroundColor: "background.paper",
    borderBottom: (theme: any) => `1px solid ${theme.palette.divider}`,
  },

  // variant="above" with indicator on top and no divider
  ".Tabs-indicatorAbove .MuiTabs-indicator": {
    bottom: undefined,
    top: 0,
  },
  ".Tabs-indicatorAbove .Tabs-tabList": {
    borderBottom: "none",
  },

  ".MuiTabs-flexContainer": {
    height: TABLIST_HEIGHT,
    backgroundColor: "background.paper",
    display: "flex",
  },

  ".Tabs-tabsCommands": {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingLeft: 1,
    paddingRight: 1,
  },

  ".Tabs-empty": {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  ".MuiTab-root": {
    minHeight: TABLIST_HEIGHT,
    height: TABLIST_HEIGHT,
    textTransform: "none",
    paddingRight: 1,

    ".Tab-icon": {
      mr: 0.5,
      fontSize: "18px",
    },

    ".Tab-tabLabel": {
      display: "flex",
      alignItems: "flex-start",
    },

    // TODO keep close icons visible on touch devices
    ".Tab-closeIcon": {
      position: "relative",
      left: "2px",
      color: "transparent",
      padding: "2px",
      borderRadius: "4px",
    },

    "&:hover": {
      backgroundColor: "action.hover",
      ".Tab-closeIcon": {
        color: "text.secondary",
      },
    },
  },

  ".Mui-selected": {
    ".Tab-closeIcon": {
      "&:hover": {
        color: "primary",
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
  /** Class applied to this component */
  className?: string

  /** Id of selected tab (controlled by parent) */
  tabId?: string

  /** Components to be used as tab panels (will use panel's id, icon, title for tabs) */
  tabs?: PanelElement[]

  /** Additional command icons shown at the end of the tab bar, eg: create tab icon */
  tabsCommands?: Command[]

  /** True if tabs can be closed, default false */
  canClose?: boolean

  /** Element to be shown when there are no tabs (usually an <Empty/> placeholder) */
  empty?: ReactElement

  /** Tab selection indicator below tab (default) or above tab? */
  variant?: "below" | "above"

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
        command: "changeTabs",
        args: {
          tabId: tabId, // newly selected tab
          tabs: props.tabs, // same list of tabs/children as before
        },
      })
    }
  }

  /** When a tab is closed we remove it from the list of tabs (and select a new one if needed) */
  function handleCloseTab(event: React.SyntheticEvent, command: Command) {
    const closedTabId = command.args.tabId
    console.debug(`Tabs.handleCloseTab - closedTabId: ${closedTabId}`)
    event.stopPropagation()

    // create new list of tabs without the tab that was just closed
    if (props.onCommand) {
      // notify parent that tab is being closed
      // in case it needs to release resources, etc
      props.onCommand(event, command)

      // filter closed tab out of children list and notify parent with new list of tabs/children
      const updatedTabs = props.tabs && props.tabs.filter((tab) => tab.props.id !== closedTabId)
      const updatedId =
        props.tabId == closedTabId ? (updatedTabs.length > 0 ? updatedTabs[0].props.id : null) : props.tabId
      props.onCommand(event, {
        command: "changeTabs",
        args: {
          tabId: updatedId,
          tabs: updatedTabs,
        },
      })
    }
  }

  /** Tab is starting to be dragged to a new position */
  function handleTabDragStart(event) {
    const draggedTabId = event.target.getAttribute("aria-label")
    const draggedTabIndex = props.tabs.findIndex((tab) => tab.props.id == draggedTabId)
    event.dataTransfer.setData("tabId", draggedTabId)
    event.dataTransfer.setData("tabIndex", draggedTabIndex)
    console.debug(`Tabs.handleTabDragStart - dragging tab: ${draggedTabId}, fromIndex: ${draggedTabIndex}`)
  
    // we need to stop the propagation of the drag event
    // otherwise the dnd handler in _app will take over but
    // we don't prevent the default behavior because we want the
    // tab to be shown dragging in the tab list
    event.stopPropagation()
  }

  /** Returns index where tab being dragged should be dropped to based on mouse position */
  function getTabDropIndex(event): number {
    const tabList = event.target.closest("div[role='tablist']") as HTMLElement
    if (tabList) {
      // position in tab list where the tab should be dropped to
      let toIndex = 0
      for (let i = 0; i < tabList.childNodes.length; i++) {
        const childTab = tabList.childNodes[i] as HTMLElement
        const childTabRect = childTab.getBoundingClientRect()
        const childTabMiddle = childTabRect.left + childTabRect.width / 2
        if (event.pageX > childTabMiddle) {
          toIndex = i + 1
        }
      }
      return toIndex
    }
    return -1
  }

  function handleTagDragOver(event) {
    event.stopPropagation()
    event.preventDefault()
  }

  /** Rearrange tabs and notify parent when a tab is dropped in a new position */
  function handleTabDrop(event) {
    event.stopPropagation()
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
          command: "changeTabs",
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

  function renderTabLabel(tab) {
    const tabProps = tab.props
    const closeCommand = {
      command: "closeTab",
      icon: "close",
      title: "Close Tab",
      args: {
        tabId: tabProps.id,
      },
    }

    return (
      <MuiTab
        key={tabProps.id}
        id={tabProps.id}
        value={tabProps.id}
        aria-label={tabProps.id}
        component="div"
        label={
          <Box sx={{ display: "flex", alignItems: "center", paddingRight: props.canClose ? 0 : 2 }}>
            <Icon className="Tab-icon">{tabProps.icon}</Icon>
            <Typography variant="body2">{tabProps.title}</Typography>
            {props.canClose && (
              <IconButton className="Tab-closeIcon" command={closeCommand} onCommand={handleCloseTab} size="small" />
            )}
          </Box>
        }
        draggable="true"
        onDragStart={handleTabDragStart}
        onDragOver={handleTagDragOver}
        onDrop={handleTabDrop}
      />
    )
  }

  function renderTabsCommands() {
    if (props.tabsCommands && props.tabsCommands.length > 0) {
      return (
        <Box className="Tabs-tabsCommands">
          {props.tabsCommands.map((command, index) => {
            return <IconButton key={index} command={command} onCommand={props.onCommand} size="small" />
          })}
        </Box>
      )
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

  const className =
    "Tabs-root" +
    (props.variant == "above" ? " Tabs-indicatorAbove" : "") +
    (props.className ? " " + props.className : "")

  if (props.tabs?.length > 0) {
    return (
      <MuiTabContext value={props.tabId}>
        <Box className={className} sx={Tabs_SxProps}>
          <Box sx={{ height: TABLIST_HEIGHT }}>
            <MuiTabList className="Tabs-tabList" onChange={handleTabsChange} variant="scrollable">
              {props.tabs && props.tabs.map((tab: any) => renderTabLabel(tab))}
              {props.tabsCommands && renderTabsCommands()}
            </MuiTabList>
          </Box>
          {renderPanels()}
        </Box>
      </MuiTabContext>
    )
  }

  // no tabs, show empty state
  return (
    <Box className={className} sx={Tabs_SxProps}>
      <Box className="Tabs-tabList">{props.tabsCommands && renderTabsCommands()}</Box>
      {props.empty && <Box className="Tabs-empty">{props.empty}</Box>}
    </Box>
  )
}
