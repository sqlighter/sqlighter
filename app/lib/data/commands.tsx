/**
 * commands.tsx - Data model for commands passed between different components of the app and its extensions
 */

import * as React from "react"

/** A single command shown for example as an icon, in a contextual menu, etc. */
export interface Command {
  /** A unique string for this command, eg: sqltr.expandAll (prefix.command) */
  command: string

  /** Icon name or actual icon node for the command (optional) */
  icon?: string | React.ReactNode

  /** A human-readable string describing this command */
  title?: string
}