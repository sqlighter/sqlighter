//
// tabslayout.tsx - layout for vscode-like apps with activity bar, sidebar, tabs, etc
//

import React, { useState } from "react"
import Head from "next/head"

import { Allotment } from "allotment"
import "allotment/dist/style.css"

import { Theme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import Box from "@mui/material/Box"
import MuiTabContext from "@mui/lab/TabContext"

import { Command, CommandEvent } from "../../lib/commands"
import { ActivityBar, ACTIVITYBAR_WIDTH } from "./activitybar"
import { PanelElement } from "./panel"
import { Tabs, TabsProps } from "./tabs"

//export const ACTIVITYBAR_WIDTH = 48
export const SIDEBAR_MIN_WIDTH = 180

interface TabsLayoutProps extends TabsProps {
  /** Page title */
  title?: string

  /** Brief subtitle shown in page's metadata */
  description?: string

  /** Additional actions to be placed on the right hand side of the tabs */
  actions?: any

  /** Activities shown as icons in activity bar and as panels in side bar */
  activities: PanelElement[]

  /** Id of selected tab (controlled by parent) */
  tabId?: string
  /** Components to be used as tab panels (will use panel's id, icon, title for tabs) */
  tabs?: PanelElement[]
  /** Additional command icons shown at the end of the tab bar, eg: create tab icon */
  tabsCommands?: Command[]

  /** Callback used to notify that selected activity has changed */
  onActivityChange?: (event: React.SyntheticEvent, activityId) => void

  /** Dispatch events when activity is selected, tabs are changed, closed, reordered, etc */
  onCommand: CommandEvent

  /** Signed in user (or null) */
  user?: object
}

/** A shared layout for tab based applications pages, includes: menu drawer, header, footer, basic actions */
export function TabsLayout(props: TabsLayoutProps) {
  // sibar with activities panel is visible?
  const [sidebarVisibile, setSidebarVisible] = useState(true)

  // TODO change layout on medium and large screens
  const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"))

  // TODO persist currently selected activity in user preferences
  const [activityId, setActivityId] = useState(props.activities[0].props.id)

  //
  // handlers
  //

  /** Track when a different activity icon is selected */
  function handleActivityChange(e, clickedActivityId) {
    setActivityId(clickedActivityId)
    setSidebarVisible(true)
    if (props.onActivityChange) {
      props.onActivityChange(e, clickedActivityId)
    }
  }

  /** Clicking currently selected activity icon will toggle sidebar open/close */
  function handleActivityClick(e, clickedActivityId) {
    if (clickedActivityId == activityId) {
      setSidebarVisible(!sidebarVisibile)
    }
  }

  /** Track sidebar visibility change when user snaps panel shut */
  function handleSidebarVisibilityChange(index, visible) {
    // https://www.npmjs.com/package/allotment
    if (index == 1) {
      setSidebarVisible(visible)
    }
  }

  //
  // render
  //

  /**
   * Sidebar shows the activity highlighted in the activity bar. The sidebar can be
   * opened or closed by clicking on the selected activity or by snapping closed the
   * allotment pane. The content of the activity is always shown for now to make it
   * easier to retain the state of the content, eg. data, scrolling position, etc.
   */
  function renderSidebar() {
    return props.activities.map((activity: PanelElement) => {
      const display = !sidebarVisibile || activity.props.id != activityId ? "none" : null
      return (
        <Box key={activity.props.id} sx={{ width: 1, height: 1, display }}>
          {activity}
        </Box>
      )
    })
  }

  return (
    <>
      <Head>
        <title>{props.title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={props.description} />
        <meta property="og:image" content="/og-image.png" />
        <meta name="og:title" content={props.title} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Box sx={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}>
        <Allotment onVisibleChange={handleSidebarVisibilityChange}>
            <Allotment.Pane maxSize={ACTIVITYBAR_WIDTH} minSize={ACTIVITYBAR_WIDTH} visible>
              <ActivityBar
                activityId={activityId}
                activities={props.activities}
                user={props.user}
                onClick={handleActivityClick}
                onChange={handleActivityChange}
              />
            </Allotment.Pane>
            <Allotment.Pane
              minSize={SIDEBAR_MIN_WIDTH}
              preferredSize={SIDEBAR_MIN_WIDTH}
              visible={sidebarVisibile}
              snap
            >
              {renderSidebar()}
            </Allotment.Pane>
          <Allotment.Pane>
            <Tabs tabId={props.tabId} tabs={props.tabs} tabsCommands={props.tabsCommands} onCommand={props.onCommand} />
          </Allotment.Pane>
        </Allotment>
      </Box>
    </>
  )
}
