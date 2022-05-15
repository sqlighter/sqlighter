//
// lorem.tsx - test page showing typography and other components
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

import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';

import DatabaseIcon from '@mui/icons-material/DnsOutlined';
import QueryIcon from '@mui/icons-material/ArticleOutlined';
import HistoryIcon from "@mui/icons-material/HistoryOutlined"
import SearchIcon from "@mui/icons-material/SearchOutlined"
import SchemaIcon from '@mui/icons-material/WeekendOutlined'; // TODO find database icon

import { Context } from "../components/context"
import { TabsLayout } from "../components/navigation/tabslayout"
import { Section } from "../components/section"

import { PanelProps } from "../components/navigation/panel"

const SSR = typeof window === "undefined"

/*
const SQLighterComponentWithNoSSR = dynamic(
  () => import('../components/layouts/tabsapp'),
  { ssr: false }
)
*/

function App(props) {
  return (
    <div>
      <div>This is test1</div>
      <Allotment>
        <Allotment.Pane minSize={200}>
          <div>This is component A</div>
        </Allotment.Pane>
        <Allotment.Pane snap minSize={300}>
          <div>This is component B</div>
        </Allotment.Pane>
      </Allotment>
    </div>
  )
}

const title = "SQLighter"

export default function AppPage(props) {
  //  <SQLighterComponentWithNoSSR />
  const context = React.useContext(Context)

  const [activityValue, setActivityValue] = useState("activity1")
  const [tabValue, setTabValue] = useState("tab1")

  const activities: PanelProps[] = [
    {
      id: "databaseActivity",
      title: "Database",
      description: "Database Schema",
      icon: <DatabaseIcon />,
      sx: { width: "100%", height: "100%" },
      children: <>Database activity</>,
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


  const tabs: PanelProps[] = [
    {
      id: "tab1",
      title: "Tab1",
      description: "description of tab 1",
      icon: <QueryIcon />,
      //sx: { backgroundColor: "beige", width: "100%", height: "100%" },
      children: <>Tab one panel</>,
    },
    {
      id: "tab2",
      title: "Untitled query, May 15, 2022",
      description: "description of tab 2",
      icon: <QueryIcon />,
      //sx: { backgroundColor: "blue", width: "100%", height: "100%" },
      children: <>Tab two panel</>,
    },
    {
      id: "tab3",
      title: "Tab3",
      description: "description of tab 3",
      icon: <DatabaseIcon />,
      //sx: { backgroundColor: "yellow", width: "100%", height: "100%" },
      children: <>Tab three panel</>,
    },
  ]

  function handleTabsChange(_, tabId) {
    setTabValue(tabId)
  }

  function handleActivityChange(_, activityId) {
    console.debug(`App.handleActivityChange - activityId: ${activityId}`)
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
      tabValue={tabValue}
      onTabChange={handleTabsChange}
      //
      user={context.user}
    />
  )
}