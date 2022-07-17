//
// card.tsx
//

import { SxProps, Theme } from "@mui/material"
import MuiCard from "@mui/material/Card"
import MuiCardActionArea from "@mui/material/CardActionArea"
import MuiCardHeader from "@mui/material/CardHeader"
import MuiCardMedia from "@mui/material/CardMedia"
import { CardProps as MuiCardProps } from "@mui/material"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import { Command, CommandEvent } from "../../lib/commands"
import { Icon } from "./icon"
import { IconButtonGroup, IconButtonGroupCommands } from "./iconbuttongroup"

const Card_SxProps: SxProps<Theme> = {

  ".Card-media": {
    height: 120,

    // light background with tint from the primary color in the theme
    backgroundColor: (theme: any) => theme.palette.primary.lighter, // extension

    textAlign: "right",
  },

  ".Card-icon": {
    ".MuiSvgIcon-root": {
      fontSize: 128,
      color: "background.paper",
    },
  },

  ".Card-actions": {
    paddingLeft: 1
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
  /** An icon to be shown (if image is null). Default is null and will use command's icon */
  icon?: string

  /** Command that will be emitted when clicked, will use title, description and icon from this command */
  command: Command
  /** Optional secondary commands shown on the right in the action area, like 'settings', etc (optional) */
  actions?: IconButtonGroupCommands

  /** Event handler for primary or secondary command */
  onCommand?: CommandEvent
}

/** Display a card with media area, avatar, title, description and possibly a secondary command */
export function Card(props: CommandCardProps) {
  let { className, image, icon, command, actions, onCommand, ...cardProps } = props
  className = "Card-root" + (className ? " " + className : "")

  let title = <Typography noWrap>{command.title}</Typography>
  if (command.description) {
    title = <Tooltip title={command.description}>{title}</Tooltip>
  }

  // one or more icon buttons to be shown in card action area
  const action = actions && <IconButtonGroup className="Card-actions" commands={actions} onCommand={onCommand} size="small" />

  return (
    <MuiCard
      className={className}
      variant="outlined"
      onClick={(event) => onCommand(event, command)}
      sx={Card_SxProps}
      {...cardProps}
    >
      <MuiCardActionArea>
        {image && <MuiCardMedia className="Card-media" image={image} />}
        {!image && (
          <MuiCardMedia className="Card-media Card-icon">
            <Icon>{icon || command.icon}</Icon>
          </MuiCardMedia>
        )}
        <MuiCardHeader avatar={<Icon>{command.icon}</Icon>} action={action} title={title} />
      </MuiCardActionArea>
    </MuiCard>
  )
}
