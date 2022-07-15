//
// activitybar.tsx - selectable activity icons plus settings and user profile
// https://code.visualstudio.com/docs/getstarted/userinterface#_activity-bar
//

import React from "react"

import { Theme, SxProps } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"

import { User } from "../../lib/items/users"
import { CommandEvent } from "../../lib/commands"
import { Icon } from "../ui/icon"
import { IconButton } from "../ui/iconbutton"
import { PanelProps, PanelElement } from "./panel"
import { UserButton } from "../auth/userbutton"

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
      borderRadius: 0,
      borderRight: "none",
    },
  },

  ".ActivityBar-home": {
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
  user?: User

  /** True if settings icon should be shown */
  showSettings?: boolean

  /** Callback used by this panel to dispatch commands back to parent components (required) */
  onCommand: CommandEvent
}

/** An activity bar with clickable main navigation icons */
export function ActivityBar(props: ActivityBarProps) {
  //
  // handlers
  //

  function handleActivityClick(event: React.SyntheticEvent, clickedActivityId: string) {
    props.onCommand(event, {
      command: "changeActivity",
      args: { id: clickedActivityId },
    })
  }

  //
  // render
  //
  return (
    <Box sx={ActivityBar_SxProps}>
      <Box className="ActivityBar-top">
        <IconButton
          className="ActivityBar-button ActivityBar-home"
          onCommand={props.onCommand}
          command={{
            command: "openHome",
            icon: "home",
            title: "Home",
          }}
        />
        {props.activityId && props.activities && (
          <Tabs scrollButtons="auto" orientation="vertical" value={props.activities && props.activityId}>
            {props.activities.map((activity: PanelElement) => (
              <Tab
                key={activity.props.id}
                value={activity.props.id}
                icon={<Icon>{activity.props.icon}</Icon>}
                iconPosition="start"
                onClick={(e) => handleActivityClick(e, activity.props.id)}
              />
            ))}
          </Tabs>
        )}
      </Box>
      <Box className="ActivityBar-bottom">
        {props.showSettings && (
          <IconButton
            className="ActivityBar-button"
            onCommand={props.onCommand}
            command={{
              command: "openSettings",
              icon: "settings",
              title: "Settings",
            }}
          />
        )}
        <UserButton className="ActivityBar-button ActivityBar-user" user={props.user} onCommand={props.onCommand} />
      </Box>
    </Box>
  )
}
