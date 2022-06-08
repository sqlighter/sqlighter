//
// connectionicon.tsx
//

import { DataConnection } from "../../lib/sqltr/connections"
import { Icon, DotColor } from "../ui/icon"

export interface ConnectionIconProps {
  /** Class applied to this component */
  className?: string
  /** Connection we're showing the status for */
  connection?: DataConnection
  /** Display a dot badge with the given color (default none) */
  dotColor?: DotColor
}

/** An icon showing the type of database and a little green dot if connected */
export function ConnectionIcon(props: ConnectionIconProps) {
  if (props.connection) {
    let dotColor = props.dotColor
    if (!dotColor) {
      // TODO show dot based on current connection status, eg. database ready, busy, disconnected
      dotColor = "success"
    }
    return (
      <Icon className={`ConnectionPicker-icon ${props.className}`} dotColor={dotColor}>
        {props.connection.configs.client}
      </Icon>
    )
  }
}
