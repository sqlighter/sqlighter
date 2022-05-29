//
// activitybar.tsx - selectable activity icons plus settings and user profile
// https://code.visualstudio.com/docs/getstarted/userinterface#_activity-bar
//

import React from "react"

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"

import { CommandEvent } from "../../lib/commands"
import { Icon } from "../ui/icon"
import { PanelProps, PanelElement } from "./panel"
import { getDisplayName, getProfileImageUrl } from "../signin"

export const ACTIVITYBAR_WIDTH = 48

const ACTIVITYBAR_TABLIST_STYLE = {
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

const ACTIVITYBAR_BUTTON_STYLE = {
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

export interface ActivityBarProps extends PanelProps {
  /** Currently selected activity */
  activityId: string

  /** List of activities to be shown */
  activities: PanelElement[]

  /** Signed in user (toggles behaviour of profile button) */
  user?: object

  /** Callback used by this panel to dispatch commands back to parent components (required) */
  onCommand: CommandEvent
}

/** An activity bar with clickable main navigation icons */
export function ActivityBar(props: ActivityBarProps) {
  const displayName = getDisplayName(props.user)
  const profileImage = getProfileImageUrl(props.user)

  //
  // handlers
  //

  function handleActivityClick(event: React.SyntheticEvent, clickedActivityId: string) {
      props.onCommand(event, {
        command: "changeActivity",
        args: { id: clickedActivityId },
      })
  }

  function handleSettingsClick(event) {
      props.onCommand(event, {
        command: "openSettings",
      })
  }

  function handleProfileClick(event) {
    props.onCommand(event, { command: props.user ? "openProfile" : "openSignin" })
  }

  //
  // render
  //

  return (
    <TabContext value={props.activityId}>
      <Box sx={{ display: "flex", flexDirection: "column", height: 1, width: ACTIVITYBAR_WIDTH }}>
        <Box sx={{ flexGrow: 1 }}>
          <TabList scrollButtons="auto" orientation="vertical" sx={ACTIVITYBAR_TABLIST_STYLE}>
            {props.activities.map((activity: PanelElement) => (
              <Tab
                key={activity.props.id}
                id={activity.props.id}
                value={activity.props.id}
                icon={<Icon>{activity.props.icon}</Icon>}
                iconPosition="start"
                onClick={(e) => handleActivityClick(e, activity.props.id)}
              />
            ))}
          </TabList>
        </Box>
        <Box
          sx={{
            width: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 2,
          }}
        >
          <Button onClick={handleSettingsClick} sx={ACTIVITYBAR_BUTTON_STYLE}>
            <Icon>settings</Icon>
          </Button>
          <Button onClick={handleProfileClick} sx={ACTIVITYBAR_BUTTON_STYLE}>
            {props.user && <Avatar alt={displayName} src={profileImage} sx={{ width: 24, height: 24 }} />}
            {!props.user && <Icon>account</Icon>}
          </Button>
        </Box>
      </Box>
    </TabContext>
  )
}
