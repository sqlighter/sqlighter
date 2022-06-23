//
// ConnectionIcon.tsx
//

import { DataConnection } from "../../lib/data/connections"
import { Icon, DotColor } from "../ui/icon"

export interface ConnectionIconProps {
  /** Class applied to this component */
  className?: string
  /** Connection we're showing the status for */
  connection?: DataConnection
  /** Display a dot badge with the given color (default none) */
  dotColor?: DotColor
}

/** An icon showing the type of database with a little green badge if connected */
export function ConnectionIcon(props: ConnectionIconProps) {
  if (props.connection) {
    let dotColor = props.dotColor
    if (!dotColor && props.connection.isConnected) {
      dotColor = "success"
    }

    const className = "ConnectionIcon-icon" + (props.className ? " " + props.className : "")
    return (
      <Icon className={className} dotColor={dotColor}>
        {props.connection.configs.client}
      </Icon>
    )
  }
}
