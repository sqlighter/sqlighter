//
// app.tsx - sqlighter as a full page application
//

import * as React from "react"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
//import SplitPane, { Pane } from "react-split-pane"
import Head from "next/head"

import { Allotment } from "allotment"
import "allotment/dist/style.css"

import Box from "@mui/material/Box"
import { useTheme } from "@mui/material/styles"
import { Typography } from "@mui/material"
import IconButton from "@mui/material/IconButton"

import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined"

import DatabaseIcon from "@mui/icons-material/DnsOutlined"
import QueryIcon from "@mui/icons-material/ArticleOutlined"
import HistoryIcon from "@mui/icons-material/HistoryOutlined"
import SearchIcon from "@mui/icons-material/SearchOutlined"
import SchemaIcon from "@mui/icons-material/WeekendOutlined" // TODO find database icon

import { Context } from "../../components/context"
import { TabsLayout } from "../../components/navigation/tabslayout"
import { Section } from "../../components/section"

import { PanelProps } from "../../components/navigation/panel"
import { DatabasePanel } from "./databasepanel"

const SSR = typeof window === "undefined"

const activities: PanelProps[] = [
  {
    id: "database-activity",
    title: "Database",
    description: "Database Schema",
    icon: <DatabaseIcon />,
    sx: { width: "100%", height: "100%" },
    children: <DatabasePanel />,
  },
  {
    id: "queriesActivity",
    title: "Queries",
    description: "Saved Queries",
    icon: <QueryIcon />,
    sx: { width: "100%", height: "100%" },
    children: <>Saved queries activity</>,
  },
  {
    id: "historyActivity",
    title: "History",
    description: "History description",
    icon: <HistoryIcon />,
    children: <>History activity</>,
  },
]

const TABS: PanelProps[] = [
  {
    id: "tab0",
    title: "Tab 0",
    description: "description of tab 0",
    icon: <QueryIcon />,
    //sx: { backgroundColor: "beige", width: "100%", height: "100%" },
    children: <>Tab zero panel</>,
  },
  {
    id: "tab1",
    //    title: "Untitled query, May 15, 2022",
    title: "Tab 1",
    description: "description of tab 1",
    icon: <QueryIcon />,
    //sx: { backgroundColor: "blue", width: "100%", height: "100%" },
    children: <>Tab 1 panel</>,
  },
  {
    id: "tab2",
    title: "Tab 2",
    description: "description of tab 3",
    icon: <DatabaseIcon />,
    //sx: { backgroundColor: "yellow", width: "100%", height: "100%" },
    children: <>Tab 2 panel</>,
  },
  {
    id: "tab3",
    title: "Tab 3",
    description: "description of tab 3",
    icon: <DatabaseIcon />,
    //sx: { backgroundColor: "yellow", width: "100%", height: "100%" },
    children: <>Tab 3 panel</>,
  },
]

/*
const SQLighterComponentWithNoSSR = dynamic(
  () => import('../components/layouts/tabsapp'),
  { ssr: false }
)
*/

const title = "SQLighter"

/** Main component for SQLighter app which includes activities, sidebar, tabs, etc... */
export default function Main(props) {
  //  <SQLighterComponentWithNoSSR />
  const context = React.useContext(Context)

  const [activityValue, setActivityValue] = useState("activity1")
  const [tabValue, setTabValue] = useState("tab1")
  const [tabs, setTabs] = useState(TABS)

  function handleActivityChange(_, activityId) {
    console.debug(`App.handleActivityChange - activityId: ${activityId}`)
  }

  function handleTabsChange(tabId?: string, tabs?: PanelProps[]) {
    console.debug(`handleTabsChange - tabId: ${tabId}, tabs: ${tabs && tabs.map((t) => t.id).join(", ")}`)
    setTabs(tabs)
    setTabValue(tabId)
  }

  function handleAddTabClick(e: React.MouseEvent<HTMLElement>): void {
    // console.debug("Main.handleAddTabClick", e)
  }

  return (
    <TabsLayout
      title="SQLighter"
      description="Lighter, mightier"
      //
      activities={activities}
      onActivityChange={handleActivityChange}
      //
      tabs={tabs}
      onTabsChange={handleTabsChange}
      onAddTabClick={handleAddTabClick}
      //
      user={context.user}
    />
  )
}
