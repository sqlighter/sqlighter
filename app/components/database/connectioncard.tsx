//
// connectioncard.tsx
//

import { CardProps as MuiCardProps } from "@mui/material"

import { ConnectionIcon } from "./connectionicon"
import { DataConnection } from "../../lib/data/connections"
import { CommandEvent } from "../../lib/commands"
import { Card } from "../ui/card"

export interface ConnectionCardProps extends MuiCardProps {
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

  return <Card className="ConnectionCard-root" image={image} command={command} secondaryCommand={secondaryCommand} onCommand={onCommand} />
}
