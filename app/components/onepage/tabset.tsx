//
// tabset.tsx - area with rolling tabs explaining product features
//

import { useState, useEffect } from "react"
import { SxProps, Theme } from "@mui/material"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"

import { useWideScreen } from "../hooks/usewidescreen"
import { Spacer } from "./spacer"

export const TABSET_LOOPING_MS = 6000

const TabSet_SxProps: SxProps<Theme> = {
  ".TabSet-contents": {
    maxWidth: 560,
  },

  ".TabSet-title": {
    fontWeight: "bold",
    marginBottom: 4,
  },

  ".TabSet-tabTitle": {
    fontWeight: "bold",
  },

  ".TabSet-tabDescription": {
    marginTop: 1,
  },

  ".TabSet-image": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    img: {
      flexShrink: 0,
      maxWidth: 1,
      maxHeight: 1,
    },
  },

  ".MuiTabs-root": {
    borderRight: "none",
  },

  ".MuiTabs-indicator": {
    right: null,
    left: 0,
    width: 4,
  },

  ".MuiButtonBase-root": {
    justifyContent: "start",
    textAlign: "left",
  },

  ".MuiTab-root": {
    textTransform: "none",
    alignItems: "start",
    maxWidth: "none",

    paddingTop: 0,
    paddingLeft: 2,
    marginBottom: 2,
  },
}

interface TabSetProps {
  /** Classname applied to component and subcomponents */
  className?: string
  /** Main title for carousel */
  title?: string
  /** Contents of tabs shown */
  tabs: { title: string; description: string; image: string | any }[]
  /** Image height, default 600px */
  imageHeight?: number
  /** Tabs on the left or the right (default is left) */
  variant?: "left" | "right"
}

/** Show a set of product features in a tabbed section of a one page site */
export function TabSet(props: TabSetProps) {
  //
  // state
  //

  const [isWideScreen] = useWideScreen()

  const className = "TabSet-root" + (props.className ? " " + props.className : "")

  // will rotate tabs automatically until user clicks on a tab and interrupts the loop
  const [value, setValue] = useState<number>(0)
  const [looping, setLooping] = useState<boolean>(true)
  useEffect(() => {
    if (looping) {
      const next = (value + 1) % props.tabs.length
      const id = setTimeout(() => setValue(next), TABSET_LOOPING_MS)
      return () => clearTimeout(id)
    }
  }, [value])

  //
  // handlers
  //

  function handleChange(event, newValue: number) {
    setLooping(false)
    setValue(newValue)
  }

  //
  // render
  //

  function renderTab(tab, index) {
    const label = (
      <>
        <Typography className="TabSet-tabTitle" variant="h6">
          {tab.title}
        </Typography>
        <Typography className="TabSet-tabDescription" variant="body1" color="text.secondary">
          {tab.description}
        </Typography>
      </>
    )
    return <Tab key={index} label={label} disableRipple={true} />
  }

  function renderContents() {
    return (
      <Grid item className="TabSet-contents" xs={12} md={6}>
        <Typography className="TabSet-title" variant={isWideScreen ? "h4" : "h5"}>
          {props.title}
        </Typography>
        <Tabs orientation="vertical" variant="scrollable" value={value} onChange={handleChange}>
          {props.tabs.map((tab, index) => renderTab(tab, index))}
        </Tabs>
      </Grid>
    )
  }

  function renderImage() {
    const imageSrc = props.tabs[value].image
    if (typeof imageSrc === "string") {
      return <img src={imageSrc} title={props.tabs[value].title} />
    }
    return imageSrc
  }

  return (
    <Box className={className} sx={TabSet_SxProps}>
      <Spacer />
      <Grid container spacing={2}>
        {props.variant !== "right" && renderContents()}
        <Grid className="TabSet-image" item xs={12} md={6}>
          {renderImage()}
        </Grid>
        {props.variant === "right" && renderContents()}
      </Grid>
      <Spacer />
    </Box>
  )
}
