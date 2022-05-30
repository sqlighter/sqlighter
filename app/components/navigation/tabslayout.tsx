//
// tabslayout.tsx - layout for vscode-like apps with activity bar, sidebar, tabs, etc
//

import React, { useState } from "react"
import Head from "next/head"
import { Allotment } from "allotment"
import "allotment/dist/style.css"
import Box from "@mui/material/Box"

import { Command } from "../commands"
import { ActivityBar, ACTIVITYBAR_WIDTH } from "./activitybar"
import { PanelElement, PanelProps } from "./panel"
import { Tabs } from "./tabs"

export const SIDEBAR_MIN_WIDTH = 180

interface TabsLayoutProps extends PanelProps {
  /** Activity that is currently selected */
  activityId: string
  /** Activities shown as icons in activity bar and as panels in side bar */
  activities: PanelElement[]

  /** Id of selected tab (controlled by parent) */
  tabId?: string
  /** Components to be used as tab panels (will use panel's id, icon, title for tabs) */
  tabs?: PanelElement[]
  /** Additional command icons shown at the end of the tab bar, eg: create tab icon */
  tabsCommands?: Command[]

  /** Signed in user (or null) */
  user?: object
}

/** A shared layout for tab based applications pages, includes: menu drawer, header, footer, basic actions */
export function TabsLayout(props: TabsLayoutProps) {
  //
  // state
  //

  // sidebar with activities panel is visible?
  const [sidebarVisible, setSidebarVisible] = useState(true)

  //
  // handlers
  //

  /** Track sidebar visibility change when user snaps panel shut */
  function handleSidebarVisibilityChange(index, visible) {
    // https://www.npmjs.com/package/allotment
    if (index == 1) {
      if (props.onCommand) {
        setSidebarVisible(visible)
      }
    }
  }

  function handleCommand(event, command: Command) {
    switch (command.command) {
      case "changeActivity":
        // clicking selected activity toggles sidebar opened or closed
        if (props.activityId == command.args.id) {
          setSidebarVisible(!sidebarVisible)
          return
        }
        break
    }

    if (props.onCommand) {
      props.onCommand(event, command)
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
      const display = !sidebarVisible || activity.props.id != props.activityId ? "none" : null
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
      <Box className="TabsLayout-root" sx={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}>
        <Allotment onVisibleChange={handleSidebarVisibilityChange}>
          <Allotment.Pane maxSize={ACTIVITYBAR_WIDTH} minSize={ACTIVITYBAR_WIDTH} visible>
            <ActivityBar
              activityId={props.activityId}
              activities={props.activities}
              user={props.user}
              onCommand={handleCommand}
            />
          </Allotment.Pane>
          <Allotment.Pane minSize={SIDEBAR_MIN_WIDTH} preferredSize={SIDEBAR_MIN_WIDTH} visible={sidebarVisible} snap>
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
