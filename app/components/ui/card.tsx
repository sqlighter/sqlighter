//
// card.tsx
//

import { ReactElement } from "react"
import { SxProps, Theme, alpha } from "@mui/material"
import Box from "@mui/material/Box"
import MuiCard from "@mui/material/Card"
import MuiCardActionArea from "@mui/material/CardActionArea"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import MuiCardHeader from "@mui/material/CardHeader"
import MuiCardMedia from "@mui/material/CardMedia"
import { CardProps as MuiCardProps } from "@mui/material"
import Tooltip from "@mui/material/Tooltip"

import { IconButton } from "./iconbutton"
import { ConnectionIcon } from "../database/connectionicon"
import { DataConnection } from "../../lib/data/connections"
import { Command, CommandEvent } from "../../lib/commands"
import { Icon } from "./icon"

//
// CommandCard
//

const Card_SxProps: SxProps<Theme> = {
  ".Card-media": {
    height: 120,

    // backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.05),
    // light background with tint from the primary color in the theme
    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),

    textAlign: "right",
  },

  ".Card-icon": {
    ".MuiSvgIcon-root": {
      fontSize: 128,

      color: (theme) => alpha(theme.palette.background.paper, 0.4),
    },
  },

  ".MuiCardHeader-content": {
    overflow: "hidden",
  },

  ".MuiCardHeader-title": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  ".MuiCardHeader-subheader": {
    width: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  ".MuiCardHeader-action": {
    // align icon vertically centered like avatar
    alignSelf: "auto",
    marginTop: 0,
    marginBottom: 0,
  },
}

export interface CommandCardProps extends MuiCardProps {
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
export function Card(props: CommandCardProps) {
  let { image, command, secondaryCommand, onCommand, ...cardProps } = props
  const className = "CommandCard-root" + (props.className ? " " + props.className : "")

  return (
    <MuiCard
      className={className}
      variant="outlined"
      square
      onClick={(event) => onCommand(event, command)}
      sx={Card_SxProps}
      {...cardProps}
    >
      <MuiCardActionArea>
        {image && <MuiCardMedia className="Card-media Card-icon" image={image} />}
        {!image && (
          <MuiCardMedia className="Card-media">
            <Icon>{command.icon}</Icon>
          </MuiCardMedia>
        )}
        <Tooltip title={command.description}>
          <MuiCardHeader
            avatar={<Icon>{command.icon}</Icon>}
            action={secondaryCommand && <IconButton command={secondaryCommand} onCommand={onCommand} />}
            title={command.title}
            subheader={command.description}
          />
        </Tooltip>
      </MuiCardActionArea>
    </MuiCard>
  )
}
