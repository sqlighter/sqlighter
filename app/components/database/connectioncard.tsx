//
// connectioncard.tsx
//

import { CardProps as MuiCardProps } from "@mui/material"

import { Card } from "../ui/card"
import { Command, CommandEvent } from "../../lib/commands"
import { ConnectionIcon } from "./connectionicon"
import { DataConnection } from "../../lib/data/connections"
import { IconButtonGroupCommands } from "../ui/iconbuttongroup"

export interface ConnectionCardProps extends MuiCardProps {
  /** Connection to be shown */
  connection: DataConnection
  /** If true adds action to download database */
  canExport?: boolean
  /** If true adds action to save database to disk */
  canSave?: boolean
  /** Show configure connection button so connection can be modified (default false) */
  canConfigure?: boolean
  /** Show close connection action? */
  canClose?: boolean
  /** Will raise 'openConnection' or 'configureConnection' */
  onCommand?: CommandEvent
}

/** A command card used to display a connection that can be opened or modified */
export function ConnectionCard(props: ConnectionCardProps) {
  const image = props.connection?.configs?.metadata?.image

  const command: Command = {
    command: "openConnection",
    title: props.connection.title,
    description: props.connection.configs?.metadata?.description,
    icon: <ConnectionIcon connection={props.connection} />,
    args: { connection: props.connection },
  }

  const actions: IconButtonGroupCommands = []
  if (props.canExport) {
    actions.push({
      command: "export",
      title: "Download",
      description: "Download Database",
      icon: "download",
      args: {
        format: null, // native format
        filename: props.connection.title,
        connection: props.connection,
      },
    })
  }
  if (props.canSave) {
    actions.push({
      command: "save",
      title: "Save",
      description: "Save",
      icon: "save",
      args: {
        connection: props.connection,
      },
    })
  }
  if (props.canConfigure) {
    actions.push({
      command: "configureConnection",
      title: "Configure",
      icon: "settings",
      args: {
        item: props.connection,
      },
    })
  }
  if (props.canClose) {
    actions.push({
      command: "closeConnection",
      title: "Close",
      icon: "close",
      args: {
        connection: props.connection,
      },
    })
  }

  return (
    <Card
      className="ConnectionCard-root"
      image={image}
      icon="database"
      command={command}
      actions={actions}
      onCommand={props.onCommand}
    />
  )
}
