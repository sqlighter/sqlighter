//
// activitybar.tsx - selectable activity icons plus settings and user profile
// https://code.visualstudio.com/docs/getstarted/userinterface#_activity-bar
//

import React, { ReactElement } from "react"

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"

import AccountIcon from "@mui/icons-material/AccountCircleOutlined"
import SettingsIcon from "@mui/icons-material/SettingsOutlined"

import { Icon } from "../ui/icon"
import { Panel, PanelProps, PanelElement } from "./panel"
import { promptSignin, getDisplayName, getProfileImageUrl } from "../signin"

export const ACTIVITYBAR_WIDTH = 48
export const SIDEBAR_MIN_WIDTH = 180

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

  /** Called when an activity is clicked (including profile and settings) */
  onClick: (event: React.SyntheticEvent, activityId: string) => void

  /** Called when selected activity tab changes */
  onChange: (event: React.SyntheticEvent, activityId: string) => void
}

/** An activity bar with clickable main navigation icons */
export function ActivityBar(props: ActivityBarProps) {
  const displayName = getDisplayName(props.user)
  const profileImage = getProfileImageUrl(props.user)

  //
  // handlers
  //

  function handleActivityClick(e, clickedActivityId) {
    if (props.activityId != clickedActivityId) {
      props.onCommand(e, { command: "changeActivity", args: { id: clickedActivityId } })
      props.onChange(e, clickedActivityId)
    } else {
      props.onClick(e, clickedActivityId)
    }
  }

  function handleSettingsClick(event) {
    if (props.onCommand) {
      props.onCommand(event, {
        command: "open.settings"
      })
    }
  }


  function handleProfileClick(e) {
    if (!props.user) {
      promptSignin()
    } else {
      // TODO show profile menu with signout
      if (props.onCommand) {
        props.onCommand(e, { command: "open.profile", args: { user: props.user } })
      }
    }
  }

  //
  // render
  //

  return (
    <TabContext value={props.activityId}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: ACTIVITYBAR_WIDTH }}>
        <Box sx={{ flexGrow: 1 }}>
          <TabList scrollButtons="auto" orientation="vertical" sx={ACTIVITYBAR_TABLIST_STYLE}>
            {props.activities.map((activity: PanelElement) => {
              const activityProps = activity.props
              return (
                <Tab
                  key={activityProps.id}
                  id={activityProps.id}
                  value={activityProps.id}
                  icon={<Icon>{activityProps.icon}</Icon>}
                  iconPosition="start"
                  onClick={(e) => handleActivityClick(e, activityProps.id)}
                />
              )
            })}
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
          <Button onClick={handleSettingsClick} sx={ACTIVITYBAR_BUTTON_STYLE}>
            <SettingsIcon />
          </Button>
          <Button onClick={handleProfileClick} sx={ACTIVITYBAR_BUTTON_STYLE}>
            {props.user && <Avatar alt={displayName} src={profileImage} sx={{ width: 24, height: 24 }} />}
            {!props.user && <AccountIcon />}
          </Button>
        </Box>
      </Box>
    </TabContext>
  )
}
