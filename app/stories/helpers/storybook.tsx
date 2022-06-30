//
// storybook.tsx - a decorator used to provide basic themed context to components in storybook
//

import React, { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Allotment } from "allotment"
import Box from "@mui/material/Box"

import { ActivityBar, ACTIVITYBAR_WIDTH } from "../../components/navigation/activitybar"
import { customTheme } from "../../components/theme"
import { Context } from "../../components/context"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"

// allotment styles + global overrides
import "allotment/dist/style.css"
import "../../public/styles.css"

// sqlighter app container
// import App from "../../pages/_app"

import { fake_user_mickey } from "./fakedata"

// Google client id used for signin client is bound below at build time
// https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
// const GOOGLE_ID = "xxxx.apps.googleusercontent.com" // workaround for google cloud build issues
const GOOGLE_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
console.assert(GOOGLE_ID, "GOOGLE_ID is undefined")

//
// StorybookDecorator
//

export function StorybookDecorator(props) {
  //
  // state
  //

  // true if google signin script has lazy loaded and has been initialized, i.e. is active
  const [googleSigninClient, setGoogleSigninClient] = useState<any>()
  useEffect(() => {
    const gsi = (window as any)?.google?.accounts?.id
    gsi.initialize({
      client_id: GOOGLE_ID,
      callback: handleGoogleSignin,
      auto_select: true,
    })
    setGoogleSigninClient(gsi)
    console.debug(`StorybookDecorator - setGoogleSigninClient`, gsi)
  }, [])

  //
  // Context that is shared will all app components includes user, status, callbacks, etc.
  //

  const context = {
    // undefined while user is loading or google signin script is loading
    user: fake_user_mickey,

    /**
     * Google Signin Client available once script is loaded and initialized
     * @see https://developers.google.com/identity/gsi/web/reference/js-reference
     */
    googleSigninClient,

    // signout + redirect callback
    signout: () => console.debug(`Context.signout was called`),
  }

  function handleGoogleSignin(response) {
    console.debug(`StorybookDecorator.handleGoogleSignin`, response)
  }

  return (
    <CssBaseline>
      <ThemeProvider theme={customTheme()}>
        <DndProvider backend={HTML5Backend}>
          <Context.Provider value={context}>
            <Box className="StorybookDecorator-root">{props.children}</Box>
          </Context.Provider>
        </DndProvider>
      </ThemeProvider>
    </CssBaseline>
  )
}

//
// Wrapper
//

/** Simple wrapper with defined height required by some components */
export function Wrapper(props) {
  return <Box sx={{ height: 800, width: 1 }}>{props.children}</Box>
}

//
// ActivityWrapper
//

export function ActivityBarWrapper(props) {
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [activityId, setActivityId] = useState(props.activityId || props.activities[0].props.id)
  function handleCommand(event, command) {
    switch (command.command) {
      case "changeActivity":
        if (activityId == command.args.id) {
          setSidebarVisible(!sidebarVisible)
        } else {
          setActivityId(command.args.id)
        }
        return
    }
    if (props.onCommand) {
      props.onCommand(event, command)
    }
  }

  return (
    <Box sx={{ height: 600, width: 800, border: 1, backgroundColor: (theme: any) => theme.palette.background.default }}>
      <Allotment onVisibleChange={() => setSidebarVisible(!sidebarVisible)}>
        <Allotment.Pane maxSize={ACTIVITYBAR_WIDTH} minSize={ACTIVITYBAR_WIDTH} visible>
          <ActivityBar
            activityId={activityId}
            activities={props.activities}
            user={props.user}
            onCommand={handleCommand}
          />
        </Allotment.Pane>
        <Allotment.Pane minSize={200} preferredSize={200} visible={sidebarVisible} snap>
          <Box sx={{ width: 1, height: 1, flexGrow: 1, overflow: "scroll" }}>
            {props.activities?.map((activity) => {
              return (
                <Box key={activity.props.id} sx={{ display: activity.props.id == activityId ? "block" : "none" }}>
                  {activity}
                </Box>
              )
            })}
          </Box>
        </Allotment.Pane>
        <Allotment.Pane>
          <Box sx={{ width: 1, height: 1, padding: 1, backgroundColor: "white" }}>Contents</Box>
        </Allotment.Pane>
      </Allotment>
    </Box>
  )
}
