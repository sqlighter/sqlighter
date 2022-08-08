//
// query.ts - a data connection query based on sql
//

import { Item } from "./items"
import { generateId } from "../shared"
import { format } from "date-fns"

export const QUERY_TYPE = "query"
export const QUERY_PREFIX = "sql_"

export const QUERY_RUN_TYPE = "run"
export const QUERY_RUN_PREFIX = "run_"

/** A data connection query with display properties, executions, sharing, etc */
export class Query extends Item {
  constructor() {
    super()
    this.id = generateId(QUERY_PREFIX)
    this.type = QUERY_TYPE
    this.createdAt = new Date().toISOString()
    this.title = `Untitled, ${format(new Date(), "LLLL d, yyyy")}`
  }

  /** Data connection used to run this query */
  connectionId?: string
  /** Database used for this query when connection has multiple databases (optional) */
  database?: string

  /** Query title, eg. Best customers (optional) */
  title?: string
  /** Short description, eg. Customers from main datalake filtered by x (optional) */
  description?: string

  /** SQL query */
  sql?: string

  /** The name of the folder in which this query was saved as a bookmark, eg. "Bookmarks" or "My Queries/Customers" (optional)  */
  folder?: string

  /** Shared access rights, eg: participants, rights, viewing modes */
  sharing?: {
    // TDB
  }

  /** Preferences used to visualize this query, for example a charting tool's settings */
  visualizations?: {
    /** Preferences for a specific visualization mode, eg. 'table', 'chart', 'code', etc... */
    [toolId: string]: any // TBD
  }

  /** Currently selected run */
  runId?: string

  /** Query executions (usually these are not persisted but client only) */
  runs?: QueryRun[]
}

/**
 * Results from the execution of a query. This class is normally not persisted
 * in storage rather it's used on the client as a data model for query results
 */
export class QueryRun extends Item {
  constructor() {
    super()
    this.id = generateId(QUERY_RUN_PREFIX)
    this.type = QUERY_RUN_TYPE
    this.status = "created"

    const now = new Date()
    this.createdAt = now.toISOString()
    this.title = now.toLocaleTimeString()
  }

  /** Query that was executed */
  query?: Query

  /** SQL code that was executed (can be a subset of query's code) */
  sql?: string

  /** Execution status */
  status: "created" | "running" | "completed" | "error"

  /** Error string if status is 'error' */
  error?: any

  /** Number of rows modified in case of inserts, delete, etc */
  rowsModified?: number

  /** Resulting columns */
  columns?: string[]

  /** Resulting data */
  values?: any[][]

  // TODO coud have a function here returning the data rather than the data itself (to support large sets and paging)
}

export default Query
