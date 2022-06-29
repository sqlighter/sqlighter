//
// tabslayout.tsx - layout for vscode-like apps with activity bar, sidebar, tabs, etc
//

import React, { useState, ReactElement } from "react"
import Head from "next/head"
import { Allotment } from "allotment"
import { Theme, SxProps } from "@mui/material/styles"
import Box from "@mui/material/Box"

import type { DropTargetMonitor } from "react-dnd"
import { useDrop } from "react-dnd"
import { NativeTypes } from "react-dnd-html5-backend"

import { User } from "../../lib/items/users"
import { Command } from "../../lib/commands"
import { ActivityBar, ACTIVITYBAR_WIDTH } from "./activitybar"
import { PanelElement, PanelProps } from "./panel"
import { Tabs } from "./tabs"
import { Sidebar, SIDEBAR_MIN_WIDTH } from "./sidebar"
import { FilesBackdrop } from "../ui/filesbackdrop"

// Styles applied to all components
export const TabsLayout_SxProps: SxProps<Theme> = {
  position: "absolute",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,

  // light gray with a border on bottom since the page is white underneat
  backgroundColor: "background.default",
  borderBottom: 1,
  borderBottomColor: "divider",

  ".TabsLayout-sidebarLogo": {
    minHeight: ACTIVITYBAR_WIDTH,
    maxHeight: ACTIVITYBAR_WIDTH,
    width: 1,
    backgroundColor: "background.paper",
  },

  ".TabsLayout-tabs": {
    width: 1,
    height: 1,

    ".MuiTabs-root": {
      backgroundColor: "background.paper",
    },
  },
}

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
  /** Element to be shown when there are no tabs (usually an <Empty/> placeholder) */
  empty?: ReactElement

  /** Signed in user (or null) */
  user?: User
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
        } else {
          setSidebarVisible(true)
        }
        break
    }

    if (props.onCommand) {
      props.onCommand(event, command)
    }
  }

  //
  // drag and drop
  //

  // https://react-dnd.github.io/react-dnd/docs/api/use-drop
  const [{ isDragging }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item: { files: any[]; items: any[] }) {
        console.debug(`TabsLayout.drop - ${item.files?.length} files`, item.files)
        console.debug(`TabsLayout.drop - ${item.items?.length} items`, item.items)
        if (props.onCommand) {
          props.onCommand(null, {
            command: "dropItems",
            args: { ...item },
          })
        }
      },
      collect: (monitor: DropTargetMonitor) => {
        return {
          isDragging: monitor.isOver(),
        }
      },
    }),
    [props]
  )

  //
  // render
  //

  return (
    <>
      <Head>
        <title>{props.title}</title>
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content={props.description} />
        <meta property="og:image" content="/og-image.png" />
        <meta name="og:title" content={props.title} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Box ref={drop} className="TabsLayout-root" sx={TabsLayout_SxProps}>
        <FilesBackdrop className="TabsLayout-backdrop" open={isDragging} />
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
            <Sidebar activityId={props.activityId} activities={props.activities} visible={sidebarVisible} />
          </Allotment.Pane>
          <Allotment.Pane>
            <Box className="TabsLayout-tabs">
              <Tabs
                tabId={props.tabId}
                tabs={props.tabs}
                tabsCommands={props.tabsCommands}
                empty={props.empty}
                onCommand={props.onCommand}
                canClose
              />
            </Box>
          </Allotment.Pane>
        </Allotment>
      </Box>
    </>
  )
}
