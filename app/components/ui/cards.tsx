//
// connectioncard.tsx
//

import { ReactElement } from "react"
import { SxProps, Theme, alpha } from "@mui/material"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import CardMedia from "@mui/material/CardMedia"
import { CardProps } from "@mui/material"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"

import { IconButton } from "./iconbutton"
import { ConnectionIcon } from "../database/connectionicon"
import { DataConnection } from "../../lib/data/connections"
import { Command, CommandEvent } from "../../lib/commands"
import { Icon } from "./icon"

//
// CommandCard
//

const CommandCard_SxProps: SxProps<Theme> = {
  ".CommandCard-media": {
    height: 120,

    // backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.05),
    // light background with tint from the primary color in the theme
    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),

    textAlign: "right",
  },

  ".CommandCard-icon": {
    ".MuiSvgIcon-root": {
      fontSize: 128,

      color: (theme) => alpha(theme.palette.background.paper, 0.4),
    },
  },

  ".MuiCardHeader-content": {
    overflow: "hidden",
  },

  ".MuiCardHeader-subheader": {
    width: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}

export interface CommandCardProps extends CardProps {
  /** Image to be shown, if missing will show the command's icon */
  image?: string
  /** Command that will be emitted when clicked, will use title, description and icon from this command */
  command: Command
  /** An optional secondary command shown on the right in the action area, like 'settings', etc (optional) */
  secondaryCommand?: Command
  /** Event handler for primary or secondary command */
  onCommand?: CommandEvent
}

/** Display a card with media area, avatar, title, description and possibly a secondary command */
export function CommandCard(props: CommandCardProps) {
  let { image, command, secondaryCommand, onCommand, ...cardProps } = props
  const className = "CommandCard-root" + (props.className ? " " + props.className : "")

  return (
    <Card
      className={className}
      variant="outlined"
      square
      onClick={(event) => onCommand(event, command)}
      sx={CommandCard_SxProps}
      {...cardProps}
    >
      <CardActionArea>
        {image && <CardMedia className="CommandCard-media CommandCard-icon" image={image} />}
        {!image && (
          <CardMedia className="CommandCard-media">
            <Icon>{command.icon}</Icon>
          </CardMedia>
        )}
        <Tooltip title={command.description}>
          <CardHeader
            avatar={<Icon>{command.icon}</Icon>}
            action={secondaryCommand && <IconButton command={secondaryCommand} onCommand={onCommand} />}
            title={command.title}
            subheader={command.description}
          />
        </Tooltip>
      </CardActionArea>
    </Card>
  )
}

//
// ConnectionCard
//

export interface ConnectionCardProps extends CardProps {
  /** The connection to be shown */
  connection: DataConnection
  /** Show settings icon button so connection can be modified */
  showSettings?: boolean
  /** Will raise 'openConnection' or 'configureConnection' */
  onCommand?: CommandEvent
}

/** A command card used to display a connection that can be opened or modified */
export function ConnectionCard(props: ConnectionCardProps) {
  const { className, connection, showSettings, onCommand, ...cardProps } = props
  const image = props.connection?.configs?.metadata?.image

  const command = {
    command: "openConnection",
    title: connection.title,
    description: connection.configs?.metadata?.description,
    icon: <ConnectionIcon connection={connection} />,
    args: { connection: props.connection },
  }

  const secondaryCommand = showSettings && {
    command: "configureConnection",
    title: "Settings",
    icon: "settings",
  }

  return <CommandCard className="ConnectionCard-root" image={image} command={command} secondaryCommand={secondaryCommand} onCommand={onCommand} />
}
