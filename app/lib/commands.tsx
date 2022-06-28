/**
 * commands.tsx - Data model for commands passed between among app components
 */

import { ReactElement, SyntheticEvent } from "react"

/** Available commands */
export type CommandType =
  /** Change selected activity @param id Activity unique id */
  | "changeActivity"
  /** Select data connection @param connection selected connection */
  | "changeConnection"
  /** Tabs have been opened, closed, rearranged, etc @param tabId Currently selected tab @param tabs List of tabs */
  | "changeTabs"
  /** Title has changed, @param title The new title */
  | "changeTitle"
  /** A tab was closed @param tabId Id of tab that was closed  */
  | "closeTab"
  /** Modify a connection settings @param item The connection to modify */
  | "configureConnection"
  /** Download data from connection @param format The format for the download */
  | "downloadData"
  /** Received files or other items from drag and drop @param files List of files to be opened @param items List of other items */
  | "dropItems"
  /** Show home page (used to manage connections) */
  | "openHome"
  /** Opens given file or shows file picker @param file The file to be opened or undefined to show file picker */
  | "openFile"
  /** Show user profile page */
  | "openProfile"
  /** Open signing page or prompt user for signin */
  | "openSignin"
  /** Show settings page */
  | "openSettings"
  /** Open given connection @param item The connection to be opened */
  | "openConnection"
  /** Show database panel @param connection The database connection */
  | "openDatabase"
  /** Open database table panel @param connection The database connection, @param table The table to be shown */
  | "openTable"
  /** Open a query panel @param connection The database connection @sql The sql statement to run */
  | "openQuery"
  /** Pin item in tree view */
  | "pin"
  /** Unpin item from tree view */
  | "unpin"

  | string

/** A single command shown for example as an icon, in a contextual menu, etc. */
export interface Command<T = { [key: string]: any }> {
  /** A unique string for this command, eg: sqlighter.expandAll (prefix.command) */
  command: CommandType

  /** Icon name or actual icon node for the command (optional) */
  icon?: string | ReactElement

  /** A human-readable short string describing this command (used as tooltip for icon buttons if description is not available) */
  title?: string | ReactElement

  /** A brief description of this command, used as tooltip if availabe (optional) */
  description?: string

  /** Arguments passed to this command (optional and command-specific) */
  args?: T
}

/** Callback used to propagate commands within the application */
export type CommandEvent<T = Command> = (event: SyntheticEvent, command: T) => void
