//
// homepanel.tsx - panel used to edit and run database queries, show results
//

// libs
import React from "react"
import { useState } from "react"
import { Theme, SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"

// model
import { DataConnection, DataConfig } from "../../lib/data/connections"
import { DataConnectionFactory } from "../../lib/data/factory"
import { useApi } from "../../lib/api"

// components
import { PanelProps } from "../navigation/panel"
import { ConnectionCard, CommandCard } from "../ui/cards"
import { FilesBackdrop } from "../ui/filesbackdrop"
import { Section } from "../ui/section"

// unique id for home panel in tabs
export const HOME_PANEL_ID = "pnl_home"

// styles applied to main and subcomponents
const HomePanel_SxProps: SxProps<Theme> = {
  maxWidth: (theme) => theme.breakpoints.values.md, // 900px

  paddingTop: 2,
  paddingLeft: 1,
  paddingRight: 1,
  paddingBottom: 2,
}

export interface HomePanelProps extends PanelProps {
  /** Currently selected connection */
  connection?: DataConnection
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
      props.connections && (
        <Section className="HomePanel-connections" title="Your connections">
          <Grid container spacing={1}>
            {props.connections.map((connection) => {
              return (
                <Grid item key={connection.id} xs={12} sm={6} md={4}>
                  <ConnectionCard connection={connection} showSettings={true} onCommand={props.onCommand} />
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
      <Section className="HomePanel-actions" title="Let's get some data">
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6} md={4}>
            <CommandCard
              command={{
                command: "openConnection",
                title: "Blank database",
                description: "Create, add tables, data, download",
                icon: "add",
                args: { connection: memoryDatabase },
              }}
              image="/images/empty5.jpg"
              onCommand={props.onCommand}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CommandCard
              command={{
                command: "openFile",
                title: "Open file",
                description: "View existing SQLite or CSV files",
                icon: "fileOpen",
              }}
              image="/images/empty6.jpg"
              onCommand={props.onCommand}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CommandCard
              command={{
                command: "dragnDrop",
                title: "Drag and drop",
                description: "Drop anywhere to open",
                icon: "dragAndDrop",
              }}
              image="/images/empty7.jpg"
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
          <Grid container spacing={1}>
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
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h5">SQLighter</Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 4 }}>
          Lighter, easier, faster. Pick any three.
        </Typography>
        {props.connections && renderConnections()}
        {renderActions()}
        {templates && renderTemplates()}
      </Box>
    </Box>
  )
}
