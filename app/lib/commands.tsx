/**
 * commands.tsx - Data model for commands passed between among app components
 */

import { ReactElement, SyntheticEvent } from "react"

/** Available commands */
export type CommandType =
  /** Add query to bookmarks or remove from bookmarks @param query The query to modify */
  | "bookmarkQuery"
  /** Change selected activity @param id Activity unique id */
  | "changeActivity"
  /** Data connection model has been changed @param connection selected connection */
  | "changeConnection"
  /** Tabs have been opened, closed, rearranged, etc @param tabId Currently selected tab @param tabs List of tabs */
  | "changeTabs"
  /** A query identified by id should be modified as indicated @param query The updated query */
  | "changeQuery"
  /** Title has changed, @param title The new title */
  | "changeTitle"
  /** Change given value, eg. from input @param value Updated value */
  | "changeValue"
  /** Close an existing connection @param connection The connection to be closed */
  | "closeConnection"
  /** A tab was closed @param tabId Id of tab that was closed  */
  | "closeTab"
  /** Modify a connection settings @param item The connection to modify */
  | "configureConnection"
  /** Remove the given list of queries from the bookmarks @param queries The queries to be removed */
  | "deleteBookmarks"
  /** Remove the given list of queries from history @param queries The queries to be removed */
  | "deleteHistory"
  /** Download data from connection @param format The format for the download */
  | "downloadData"
  /** Received files or other items from drag and drop @param files List of files to be opened @param items List of other items */
  | "dropItems"
  /** Export a database, a table's contents or results of a query @param format @param filename @param connection @param database @param table @param sql */
  | "export"
  /** Open given connection @param item The connection to be opened */
  | "openConnection"
  /** Show database panel @param connection The database connection */
  | "openDatabase"
  /** Opens given file or shows file picker @param file The file to be opened or undefined to show file picker */
  | "openFile"
  /** Show home page (used to manage connections) */
  | "openHome"
  /** Show history activity @param query Filter history for given query */
  | "openHistory"
  /** Show user profile page */
  | "openProfile"
  /** Open a query panel @param connection The database connection @sql The sql statement to run */
  | "openQuery"
  /** Show settings page */
  | "openSettings"
  /** Open database table panel @param connection The database connection, @param table The table to be shown */
  | "openTable"
  /** Link to given url @param href Url to go to */
  | "openUrl"
  /** Run the given query and produce a new QueryRun @param query The query to run */
  | "runQuery"
  /** Pin item in tree view */
  | "pin"
  /** Select data connection @param connection selected connection */
  | "setConnection"
  /** Open signing page or prompt user for signin */
  | "signin"
  /** Sign out from user session @params redirectUrl Optional url where to go when signed out */
  | "signout"
  /** Unpin item from tree view */
  | "unpin"
  // generic open-ended type
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

