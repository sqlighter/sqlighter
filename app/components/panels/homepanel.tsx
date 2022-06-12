//
// querypanel.tsx - panel used to edit and run database queries, show results
//

// libs
import React from "react"
import { useState, useRef } from "react"
import { Theme, SxProps } from "@mui/material"
import { Allotment } from "allotment"
import { format } from "sql-formatter"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"
import Grid from "@mui/material/Grid"

import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardHeader from "@mui/material/CardHeader"
import CardMedia from "@mui/material/CardMedia"
import CardContent from "@mui/material/CardContent"
import CardActions from "@mui/material/CardActions"

import { useApi } from "../../lib/api"

// model
import { Command } from "../../lib/commands"
import { DataConnection, DataConfig } from "../../lib/data/connections"
import { DataConnectionFactory } from "../../lib/data/factory"
import Query, { QueryRun } from "../../lib/items/query"

// components
import { Icon } from "../ui/icon"
import { IconButton } from "../ui/iconbutton"
import { IconButtonGroup } from "../ui/iconbuttongroup"
import { PanelProps } from "../navigation/panel"
import { Tabs } from "../navigation/tabs"
import { ActionCard, ConnectionCard } from "../ui/cards"
//import { ConnectionCard } from "../database/connectioncard"
import { ConnectionIcon } from "../database/connectionicon"
import { ConnectionPicker } from "../database/connectionpicker"
import { SqlEditor } from "../editor/sqleditor"
import { QueryRunPanel } from "../database/queryrunpanel"
import { useForceUpdate } from "../hooks/useforceupdate"
import { TitleField } from "../ui/titlefield"
import { Empty } from "../ui/empty"
import { FilesBackdrop } from "../ui/filesbackdrop"
import { Section } from "../ui/section"

// unique id for home panel in tabs
export const HOME_PANEL_ID = "pnl_home"

// styles applied to main and subcomponents
const HomePanel_SxProps: SxProps<Theme> = {
  width: 1,
  minWidth: 360,
  height: 1,
  maxHeight: 1,

  paddingTop: 1.5,
  paddingLeft: 1,
  paddingRight: 1,
  paddingBottom: 1,

  display: "flex",
  flexDirection: "column",

  ".HomePanel-section": {
    marginBottom: 4,
  },

  ".HomePanel-sectionTitle": {
    //
  },

  ".HomePanel-collection": {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",

    ".ActionCard-root": {
      width: 240,
      marginRight: 2,
      marginBottom: 2,
    },
  },

  // area with title, connections picker, run button, commands
  ".QueryPanel-header": {
    width: 1,
    paddingBottom: 2,
  },

  ".QueryPanel-title": {
    flexGrow: 1,
    paddingLeft: 0.75,
  },

  ".QueryPanel-commands": {
    paddingTop: 0.5,
  },

  ".QueryPanel-run": {
    //height: 36,
  },

  // stacked editor and results
  ".QueryPanel-bottomResults": {
    ".QueryPanel-editorBox": {
      width: 1,
      height: 1,
      display: "flex",
      flexDirection: "column",
      paddingBottom: "6px",
    },
    ".QueryPanel-resultsBox": {
      width: 1,
      height: 1,
      display: "flex",
      flexDirection: "column",
      paddingTop: "2px",
    },
  },

  // editor and results side by side
  ".QueryPanel-rightResults": {
    ".QueryPanel-editorBox": {
      width: 1,
      height: 1,
      display: "flex",
      flexDirection: "column",
      paddingRight: "6px",
    },
    ".QueryPanel-resultsBox": {
      width: 1,
      height: 1,
      display: "flex",
      flexDirection: "column",
      paddingLeft: "2px",
    },
  },

  ".QueryPanel-card": {
    flexGrow: 1,
    width: 1,
    overflow: "hidden",
  },
}

export interface HomePanelProps extends PanelProps {
  /** Currently selected connection */
  connection?: DataConnection
  /** All available data connections */
  connections?: DataConnection[]
}

/** Panel used to edit and run database queries, show results  */
export function HomePanel(props: HomePanelProps) {
  //
  // state
  //

  // database templates retrieve from the server (basically connection config objects)
  const { data: templates } = useApi<DataConfig[]>("/databases/templates.json")

  // layout changes on medium and large screens
  const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"))

  // clicking on the drag and drop action shows backdrop
  const [showingDragnDrop, setShowingDragnDrop] = useState(false)

  // used to force a refresh when data model changes
  const forceUpdate = useForceUpdate()
  function notifyChanges() {
    forceUpdate()
    if (props.onCommand) {
      props.onCommand(null, {
        command: "changeConnections",
        args: {
          item: props.connections,
        },
      })
    }
  }

  //
  // handlers
  //

  async function handleCommand(e: React.SyntheticEvent, command: Command) {
    console.debug(`HomePanel.handleCommand - ${command.command}`, command)
    switch (command.command) {
    }
  }

  //
  // render
  //

  function renderHeader() {
    // TODO run label could change automatically to: run, run selection, run all based on editor selection
    return (
      <Box className="QueryPanel-header">
        <Stack direction="row" spacing={1} sx={{ width: 1 }}>
          <Typography variant="h3">SQLighter</Typography>
          <Typography variant="body1" color="text.secondary">
            Create, explore, deploy
          </Typography>
          <ConnectionPicker
            connection={props.connection}
            connections={props.connections}
            onCommand={handleCommand}
            variant="compact"
            // buttonVariant="outlined"
            buttonProps={{ sx: { width: 60 } }}
          />
        </Stack>
        {renderCommands()}
      </Box>
    )
  }

  /** Commands shown below query title */
  function renderCommands() {
    const commands: (Command | "spacing")[] = [
      { command: "info", icon: "info", title: "Details" },
      { command: "bookmark", icon: "bookmark", title: "Bookmark" },
      { command: "history", icon: "history", title: "History" },
      "spacing",
      { command: "prettify", icon: "autofix", title: "Prettify" },
      "spacing",
      { command: "comment", icon: "comment", title: "Comments" },
      { command: "share", icon: "share", title: "Share" },
    ]

    // TODO show a user's avatar or list of users which share this query instead of plain info icon
    return <IconButtonGroup commands={commands} size="small" onCommand={handleCommand} />
  }

  function renderActions() {
    return (
      <Box className="HomePanel-section" sx={{ mb: 4 }}>
        <Typography className="HomePanel-sectionTitle" gutterBottom variant="subtitle1">
          Let's get some data
        </Typography>
        <Box className="HomePanel-collection">
          <ActionCard
            command={{ command: "openBlank", title: "Blank database" }}
            description="Create a new database, add tables, add data, then download it to your desktop"
            overline="SQLite"
            image="/images/empty5.jpg"
            onCommand={props.onCommand}
          />
          <ActionCard
            command={{ command: "openFile", title: "Open file" }}
            description="View an existing .db or .sqlite file, explore tables, add data, visualizations, etc."
            overline="SQLite CSV"
            image="/images/empty6.jpg"
            onCommand={props.onCommand}
          />
          <ActionCard
            command={{ command: "dragnDrop", title: "Drag and drop" }}
            description="Drag a database anywhere on the page to view it. Will also take .csv files and convert them"
            overline="SQLite CSV"
            image="/images/empty7.jpg"
            onMouseDown={(e) => setShowingDragnDrop(true)}
            onMouseUp={(e) => {
              console.log("zaccc")
              setTimeout(() => setShowingDragnDrop(false), 150)
            }}
          />
          <ActionCard
            command={{ command: "createConnection", title: "Configure and connect" }}
            description="Create a new database, add tables, add data, then download it to your desktop"
            overline="SQLite MySQL MSSQL PostgreSQL"
            image="/images/empty8.jpg"
            onCommand={props.onCommand}
          />
        </Box>
      </Box>
    )
  }

  function renderConnections() {
    return (
      props.connections && (
        <Section className="HomePanel-connections" title="Your connections">
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {props.connections.map((connection) => {
              return (
                <Box sx={{ mr: 2, mb: 2 }}>
                  <ConnectionCard
                    key={connection.id}
                    connection={connection}
                    showSettings={true}
                    onCommand={props.onCommand}
                  />
                </Box>
              )
            })}
          </Box>
        </Section>
      )
    )
  }

  function renderTemplates() {
    if (templates) {
      const connections = templates.map((configs) => DataConnectionFactory.create(configs))
      return (
        <Section className="HomePanel-templates" title="Templates">
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {connections.map((connection, index) => {
              return (
                <Box sx={{ mr: 2, mb: 2 }}>
                  <ConnectionCard key={connection.id} connection={connection} onCommand={props.onCommand} />
                </Box>
              )
            })}
          </Box>
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
        {renderActions()}
        {props.connections && renderConnections()}
        {templates && renderTemplates()}
      </Box>
    </Box>
  )
}
