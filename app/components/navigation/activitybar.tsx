//
// activitybar.tsx - selectable activity icons plus settings and user profile
// https://code.visualstudio.com/docs/getstarted/userinterface#_activity-bar
//

import React from "react"

import { Theme, SxProps } from "@mui/material/styles"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"

import { CommandEvent } from "../../lib/commands"
import { Icon } from "../ui/icon"
import { IconButton } from "../ui/iconbutton"
import { PanelProps, PanelElement } from "./panel"
import { getDisplayName, getProfileImageUrl, getEmail } from "../signin"

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
  const email = getEmail(props.user)

  //
  // handlers
  //

  function handleActivityClick(event: React.SyntheticEvent, clickedActivityId: string) {
    props.onCommand(event, {
      command: "changedActivity",
      args: { id: clickedActivityId },
    })
  }

  //
  // render
  //

  /** Profile avatar if user is logged in or signin command otherwise */
  function renderProfile() {
    if (!props.user) {
      return (
        <IconButton
          className="ActivityBar-button"
          onCommand={props.onCommand}
          command={{
            command: "openSignin",
            icon: "account",
            title: "Sign in",
          }}
        />
      )
    }

    const avatar = <Avatar alt={displayName} src={profileImage} sx={{ width: 24, height: 24 }} />
    const avatarTooltip =
      displayName || email ? (
        <div>
          {displayName}
          <br />
          {email}
        </div>
      ) : (
        "Profile"
      )

    return (
      <IconButton
        className="ActivityBar-button"
        onCommand={props.onCommand}
        command={{
          command: "openProfile",
          icon: avatar,
          title: avatarTooltip,
        }}
      />
    )
  }

  return (
    <TabContext value={props.activityId}>
      <Box sx={ActivityBar_SxProps}>
        <Box className="ActivityBar-top">
          <IconButton
            className="ActivityBar-button ActivityBar-logo"
            onCommand={props.onCommand}
            command={{
              command: "openHome",
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
          {renderProfile()}
        </Box>
      </Box>
    </TabContext>
  )
}
