//
// activitybar.tsx - selectable activity icons plus settings and user profile
// https://code.visualstudio.com/docs/getstarted/userinterface#_activity-bar
//

import React from "react"

import { Theme, SxProps } from "@mui/material/styles"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"

import { CommandEvent } from "../../lib/commands"
import { Icon } from "../ui/icon"
import { IconButton } from "../ui/iconbutton"
import { PanelProps, PanelElement } from "./panel"
import { getDisplayName, getProfileImageUrl } from "../signin"

export const ACTIVITYBAR_WIDTH = 48

export const ActivityBar_SxProps: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  height: 1,
  width: ACTIVITYBAR_WIDTH,

  borderRight: 1,
  borderRightColor: "divider",

  ".ActivityBar-top": {
    flexGrow: 1,
  },

  ".ActivityBar-bottom": {
    width: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2,
  },

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

  ".ActivityBar-button": {
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
  },

  ".ActivityBar-logo": {
    backgroundColor: "background.paper",
    borderBottom: 1,
    borderBottomColor: "divider",
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

  function handleProfileClick(event) {
    props.onCommand(event, { command: props.user ? "openProfile" : "openSignin" })
  }

  //
  // render
  //

  return (
    <TabContext value={props.activityId}>
      <Box sx={ActivityBar_SxProps}>
        <Box className="ActivityBar-top">
          <IconButton
            className="ActivityBar-button ActivityBar-logo"
            onCommand={props.onCommand}
            command={{
              command: "home",
              icon: "home",
              title: "Home",
            }}
          />

          <TabList scrollButtons="auto" orientation="vertical">
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
        <Box className="ActivityBar-bottom">
          <IconButton
            className="ActivityBar-button"
            onCommand={props.onCommand}
            command={{
              command: "openSettings",
              icon: "settings",
              title: "Settings",
            }}
          />
          <Button className="ActivityBar-button" onClick={handleProfileClick}>
            {props.user && <Avatar alt={displayName} src={profileImage} sx={{ width: 24, height: 24 }} />}
            {!props.user && (
              <Box>
                <Icon>account</Icon>
              </Box>
            )}
          </Button>
        </Box>
      </Box>
    </TabContext>
  )
}
