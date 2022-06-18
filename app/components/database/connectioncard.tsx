//
// connectioncard.tsx
//

import { CardProps as MuiCardProps } from "@mui/material"

import { ConnectionIcon } from "./connectionicon"
import { DataConnection } from "../../lib/data/connections"
import { CommandEvent } from "../../lib/commands"
import { Card } from "../ui/card"

export interface ConnectionCardProps extends MuiCardProps {
  /** Connection to be shown */
  connection: DataConnection
  /** Show configure connection button so connection can be modified (default false) */
  canConfigure?: boolean
  /** Will raise 'openConnection' or 'configureConnection' */
  onCommand?: CommandEvent
}

/** A command card used to display a connection that can be opened or modified */
export function ConnectionCard(props: ConnectionCardProps) {
  const image = props.connection?.configs?.metadata?.image

  const command = {
    command: "openConnection",
    title: props.connection.title,
    description: props.connection.configs?.metadata?.description,
    icon: <ConnectionIcon connection={props.connection} />,
    args: { connection: props.connection },
  }

  const configureCommand = props.canConfigure && {
    command: "configureConnection",
    title: "Configure",
    icon: "settings",
    args: {
      item: props.connection,
    },
  }

  return (
    <Card
      className="ConnectionCard-root"
      image={image}
      icon="database"
      command={command}
      secondaryCommand={configureCommand}
      onCommand={props.onCommand}
    />
  )
}
