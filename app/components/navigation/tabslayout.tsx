//
// tabslayout.tsx - layout for vscode-like apps with activity bar, sidebar, tabs, etc
//

import Head from "next/head"
import { useState } from "react"

import { Allotment } from "allotment"
import "allotment/dist/style.css"

import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import { Theme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import Box from "@mui/material/Box"

import { ActivityBar, ACTIVITYBAR_WIDTH } from "./activitybar"
import { SideBar, SIDEBAR_MIN_WIDTH } from "./sidebar"
import { Panel, PanelProps } from "./panel"
import { Tabs } from "./tabs"

interface TabsLayoutProps {
  /** Page title */
  title?: string

  /** Brief subtitle shown in page's metadata */
  description?: string

  /** Additional actions to be placed on the right hand side of the tabs */
  actions?: any

  /** Activities shown as icons in activity bar and as panels in side bar */
  activities: PanelProps[]

  /** Callback used to notify that selected activity has changed */
  onActivityChange?: (event: React.SyntheticEvent, activityId) => void

  /** List of tab panels to be shown (includes title, contents, etc) */
  tabs?: PanelProps[]

  /** Called when a tab is selected, a tab is closed, tabs order changes, etc. */
  onTabsChange?: (tabId?: string, tabs?: PanelProps[]) => void

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
  const [activityId, setActivityId] = useState(props.activities[0].id)

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
      <Box sx={{ width: "100%", height: "100%" }}>
        <Allotment onVisibleChange={handleSidebarVisibilityChange}>
          <Allotment.Pane maxSize={ACTIVITYBAR_WIDTH} minSize={ACTIVITYBAR_WIDTH} visible>
            <ActivityBar
              activities={props.activities}
              activityId={activityId}
              user={props.user}
              onClick={handleActivityClick}
              onChange={handleActivityChange}
            />
          </Allotment.Pane>
          <Allotment.Pane minSize={SIDEBAR_MIN_WIDTH} preferredSize={SIDEBAR_MIN_WIDTH} visible={sidebarVisibile} snap>
            <SideBar activities={props.activities} activityId={activityId} />
          </Allotment.Pane>
          <Allotment.Pane>
            <Tabs tabs={props.tabs} onTabsChange={props.onTabsChange} />
          </Allotment.Pane>
        </Allotment>
      </Box>
    </>
  )
}
