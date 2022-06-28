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

import { IconButton } from "./iconbutton"
import { Command, CommandEvent } from "../../lib/commands"
import { Icon } from "./icon"

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
  /** An optional secondary command shown on the right in the action area, like 'settings', etc (optional) */
  secondaryCommand?: Command

  /** Event handler for primary or secondary command */
  onCommand?: CommandEvent
}

/** Display a card with media area, avatar, title, description and possibly a secondary command */
export function Card(props: CommandCardProps) {
  let { image, icon, command, secondaryCommand, onCommand, ...cardProps } = props
  const className = "Card-root" + (props.className ? " " + props.className : "")

  return (
    <Tooltip title={command.description}>
      <MuiCard
        className={className}
        variant="outlined"
        square
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
          <MuiCardHeader
            avatar={<Icon>{command.icon}</Icon>}
            action={secondaryCommand && <IconButton command={secondaryCommand} onCommand={onCommand} />}
            title={command.title}
            subheader={command.description}
          />
        </MuiCardActionArea>
      </MuiCard>
    </Tooltip>
  )
}
