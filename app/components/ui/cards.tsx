//
// connectioncard.tsx
//

import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import CardMedia from "@mui/material/CardMedia"
import { CardProps } from "@mui/material"
import Typography from "@mui/material/Typography"

import { IconButton } from "./iconbutton"
import { ConnectionIcon } from "../database/connectionicon"
import { DataConnection } from "../../lib/data/connections"
import { Command, CommandEvent } from "../../lib/commands"
import { Icon } from "./icon"

//
// ActionCard
//

export interface ActionCardProps extends CardProps {
  image?: string

  description?: string

  command: Command

  onCommand?: CommandEvent
}

export function ActionCard(props: any) {
  const { image, description, command, onCommand, ...cardProps } = props

  function handleClick(e) {
    if (props.onCommand) {
      props.onCommand(e, props.command)
    }
  }

  return (
    <Card className="ActionCard-root" variant="outlined" square onClick={handleClick} {...cardProps}>
      <CardActionArea>
        <CardMedia component="img" height="120" image={props.image} alt="Paella dish" />
        <CardContent>
          <Box sx={{ display: "flex" }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {props.command.title}
            </Typography>
            <Icon sx={{ color: "text.secondary" }}>{props.command.icon}</Icon>
          </Box>
          <Typography gutterBottom variant="body2" color="text.secondary">
            {props.description}
          </Typography>
          <Typography variant="overline" component="div" color="primary.main">
            {props.overline}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

//
// ConnectionCard
//

export interface ConnectionCardProps {
  /** The connection to be shown */
  connection: DataConnection
  /** Show settings icon button so connection can be modified */
  showSettings?: boolean
  /** Will raise 'openConnection' or 'configureConnection' */
  onCommand?: CommandEvent
}

/** Display a connection in a card */
export function ConnectionCard(props: ConnectionCardProps) {
  function handleOpenClick(event) {
    if (props.onCommand) {
      props.onCommand(event, { command: "openConnection", args: { connection: props.connection } })
    }
  }

  // TODO use alternate for image based on connection.config.client when image not available
  const imageUrl = props.connection?.configs?.metadata?.image
  const configureCommand = { command: "configureConnection", icon: "settings", title: "Settings" }

  return (
    <Card className="ConnectionCard-root" sx={{ width: 240 }} variant="outlined" square onClick={handleOpenClick}>
      <CardActionArea>
        <CardMedia component="img" height="120" image={imageUrl} alt={props.connection.title} />
        <CardHeader
          avatar={<ConnectionIcon connection={props.connection} />}
          action={props.showSettings && <IconButton command={configureCommand} onCommand={props.onCommand} />}
          title={props.connection.title}
          subheader="September 14, 2016"
        />
      </CardActionArea>
    </Card>
  )
}
