//
// activitybar.tsx - selectable icons and related sidebar panels
// https://code.visualstudio.com/docs/getstarted/userinterface#_activity-bar
//

import { useState } from "react"

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import Button from "@mui/material/Button"
import AccountIcon from "@mui/icons-material/AccountCircleOutlined"
import SettingsIcon from "@mui/icons-material/SettingsOutlined"

import { Panel, PanelProps } from "./panel"
import { promptSignin, getDisplayName, getProfileImageUrl } from "../signin"

export const ACTIVITYBAR_WIDTH = 48
export const SIDEBAR_MIN_WIDTH = 160
export const SIDEBAR_MAX_WIDTH = 240

const ACTIVITY_TABLIST_STYLE = {
  ".MuiTabs-indicator": {
    left: 0,
  },
  ".MuiTab-root": {
    minWidth: ACTIVITYBAR_WIDTH,
    width: ACTIVITYBAR_WIDTH,
    "&:hover": {
      backgroundColor: "action.hover",
    },
  },
}

const ACTIVITY_BUTTON_STYLE = {
  color: "text.secondary",
  minWidth: ACTIVITYBAR_WIDTH,
  width: ACTIVITYBAR_WIDTH,
  height: ACTIVITYBAR_WIDTH,
  borderRadius: 0,
  ".MuiTouchRipple-child": {
    backgroundColor: "primary.main",
  },
  "&:hover": {
    backgroundColor: "action.hover",
  },
}

export interface ActivityBarProps {
  /** List of activities to be shown */
  activities: PanelProps[]

  /** Called when an activity is selected */
  onActivityChange?: (event: React.SyntheticEvent, activityId: any) => void

  /** Signed in user (toggles behaviour of profile button */
  user?: object
}

/** An activity bar with clickable main navigation icons and sidebar panels */
export function ActivityBar({ activities, onActivityChange, user }: ActivityBarProps) {
  // TODO selected activity should be persisted in localStorage or user preferences
  const [activityId, setActivityId] = useState(activities[0].id)

  // TODO needs to resize the parent view or notify of size change
  const [sidebarVisible, setSidebarVisible] = useState(true)

  //
  // handlers
  //

  function handleActivityChange(e, itemId) {
    // console.debug(`ActivityBar.handleActivityChange - activityId: ${activityId}`)
    setActivityId(itemId)
    setSidebarVisible(true)
    if (onActivityChange) {
      onActivityChange(e, itemId)
    }
  }

  function handleActivityClick(e, itemId) {
    if (activityId == itemId) {
      console.debug(`ActivityBar.handleActivityClick - toggle sidebar: ${!sidebarVisible}`)
      setSidebarVisible(!sidebarVisible)
    }
  }

  function handleProfileClick(e) {
    console.debug(`ActivityBar.handleProfileClick`)
    if (!user) {
      promptSignin()
    }
  }

  function handleSettingsClick(e) {
    console.debug(`ActivityBar.handleSettingsClick`)
  }

  //
  // rendering
  //

  /** Generic profile icon unless user's image is available */
  function getProfileButton() {
    return (
      <Button onClick={handleProfileClick} sx={ACTIVITY_BUTTON_STYLE}>
        {user && <Avatar alt={getDisplayName(user)} src={getProfileImageUrl(user)} sx={{ width: 24, height: 24 }} />}
        {!user && <AccountIcon />}
      </Button>
    )
  }

  return (
      <TabContext value={activityId}>
        <Box sx={{ display: "flex", flexDirection: "row", height: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: ACTIVITYBAR_WIDTH }}>
            <Box sx={{ flexGrow: 1 }}>
              <TabList onChange={handleActivityChange} scrollButtons="auto" orientation="vertical" sx={ACTIVITY_TABLIST_STYLE}>
                {activities.map((activity: any) => (
                  <Tab
                    value={activity.id}
                    icon={activity.icon}
                    iconPosition="start"
                    onClick={(e) => handleActivityClick(e, activity.id)}
                  />
                ))}
              </TabList>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 2,
              }}
            >
              <Box sx={{ width: 48, height: 48, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Button onClick={handleSettingsClick} sx={ACTIVITY_BUTTON_STYLE}>
                  <SettingsIcon />
                </Button>
              </Box>
              {getProfileButton()}
            </Box>
          </Box>
          <Box sx={{ width: "100%", height: "100%" }} hidden={!sidebarVisible}>
            {activities.map((activity: any) => (
              <TabPanel
                key={activity.id}
                id={activity.id}
                value={activity.id}
                sx={{ padding: 0, width: "100%", height: "100%" }}
              >
                <Panel {...activity} />
              </TabPanel>
            ))}
          </Box>
        </Box>
      </TabContext>
  )
}
