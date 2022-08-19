//
// homepanel.tsx - panel used to edit and run database queries, show results
//

// libs
import React from "react"
import { useState } from "react"
import { Theme, SxProps, Typography } from "@mui/material"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Link from "@mui/material/Link"

// model
import { DataConnection, DataConfig } from "../../lib/data/connections"
import { DataConnectionFactory } from "../../lib/data/factory"
import { useApi } from "../hooks/useapi"

// components
import { PanelProps } from "../navigation/panel"
import { Card } from "../ui/card"
import { ConnectionCard } from "../database/connectioncard"
import { FilesBackdrop } from "../ui/filesbackdrop"
import { Section } from "../ui/section"
import { Icon } from "../ui/icon"
import { Footer } from "../onepage/footer"

// unique id for home panel in tabs
export const HOME_PANEL_ID = "pnl_home"

// styles applied to main and subcomponents
const HomePanel_SxProps: SxProps<Theme> = {
  minWidth: (theme) => theme.breakpoints.values.xs, // 600px
  maxWidth: (theme) => theme.breakpoints.values.md, // 900px
  minHeight: 1,

  paddingTop: 2,
  paddingLeft: 1,
  paddingRight: 1,
  paddingBottom: 2,

  display: "flex",
  flexDirection: "column",
  alignItems: "start",

  ".HomePanel-icon": {
    height: 0,
    width: 1,
    display: "flex",
    justifyContent: "flex-end",
    ".MuiSvgIcon-root": {
      fontSize: 120,
      color: "white",
      opacity: 0.8,
    },
  },

  ".HomePanel-connections": {
    paddingTop: 4,
  },

  ".HomePanel-actions": {
    paddingTop: 4,
  },

  ".HomePanel-templates": {
    paddingTop: 4,
  },

  ".MuiContainer-root": {
    paddingLeft: 0,
    paddingRight: 0,
  },

  ".Footer-box": {
    paddingTop: 2,
    paddingBottom: 0,
    marginBottom: -2,
  },
}

export interface HomePanelProps extends PanelProps {
  /** All available data connections */
  connections?: DataConnection[]
}

/** Home panel shows connections, templates and other commands  */
export function HomePanel(props: HomePanelProps) {
  //
  // state
  //

  // database templates retrieve from the server (basically connection config objects)
  const { data: templates } = useApi<DataConfig[]>("/databases/templates.json")

  // clicking on the drag and drop action shows backdrop
  const [showingDragnDrop, setShowingDragnDrop] = useState(false)

  //
  // render
  //

  function renderConnections() {
    return (
      props.connections?.length > 0 && (
        <Section className="HomePanel-connections" title="Your connections">
          <Grid container spacing={2}>
            {props.connections.map((connection: DataConnection) => {
              const canExport = connection.canExport()
              const canSave = !!(canExport && connection.configs?.connection?.fileHandle)
              return (
                <Grid item key={connection.id} xs={12} sm={6} md={4}>
                  <ConnectionCard
                    connection={connection}
                    canExport={canExport}
                    canSave={canSave}
                    canClose={true}
                    onCommand={props.onCommand}
                  />
                </Grid>
              )
            })}
          </Grid>
        </Section>
      )
    )
  }

  function renderActions() {
    const memoryDatabase = DataConnectionFactory.create({
      client: "sqlite3",
      title: "Empty.db",
      connection: {
        filename: ":memory:",
      },
    })

    return (
      <Section className="HomePanel-actions" title="Let's get some data 👍🏼">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              command={{
                command: "openConnection",
                title: "Blank database",
                description: "Create, add tables, data, download",
                icon: "add",
                args: { connection: memoryDatabase },
              }}
              image="/images/blank.jpeg"
              onCommand={props.onCommand}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              command={{
                command: "openFile",
                title: "Open file",
                description: "View existing SQLite or CSV files",
                icon: "fileOpen",
              }}
              image="/images/openfile.jpeg"
              onCommand={props.onCommand}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              command={{
                command: "dragAndDrop",
                title: "Drag and drop",
                description: "Drop anywhere to open",
                icon: "dragAndDrop",
              }}
              image="/images/draganddrop.jpeg"
              onMouseDown={(e) => setShowingDragnDrop(true)}
              onMouseUp={(e) => {
                setTimeout(() => setShowingDragnDrop(false), 150)
              }}
            />
          </Grid>
        </Grid>
      </Section>
    )
  }

  function renderTemplates() {
    if (templates) {
      const connections = templates.map((configs) => DataConnectionFactory.create(configs))
      return (
        <Section className="HomePanel-templates" title="Templates">
          <Grid container spacing={2}>
            {connections.map((connection) => {
              return (
                <Grid item key={connection.id} xs={12} sm={6} md={4}>
                  <ConnectionCard connection={connection} onCommand={props.onCommand} />
                </Grid>
              )
            })}
          </Grid>
        </Section>
      )
    }
  }

  return (
    <Box className="HomePanel-root" sx={HomePanel_SxProps}>
      <FilesBackdrop open={showingDragnDrop} onMouseUp={(e) => setTimeout(() => setShowingDragnDrop(false), 200)} />
      <Box className="HomePanel-icon">
        <Icon>sqlighter</Icon>
      </Box>
      <img src="/branding/logo.png" alt="SQLighter" height="40" />
      <Typography variant="subtitle2" color="text.secondary" sx={{ position: "relative", left: "36px", top: "-6px" }}>
        <Link href="/site" target="_blank" underline="hover">Database Explorer for SQLite</Link> (alpha)
      </Typography>
      {props.connections && renderConnections()}
      {renderActions()}
      {templates && renderTemplates()}
      <Box sx={{ flexGrow: 1 }}></Box>
      <Footer />
    </Box>
  )
}
