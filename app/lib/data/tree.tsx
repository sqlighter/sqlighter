//
// tree.tsx - data model for hierachical information often shown using TreeView
//

import * as React from "react"

// NOTE where possible we try using APIs similar to vscode
// https://code.visualstudio.com/api/extension-guides/tree-view
// https://code.visualstudio.com/api/references/vscode-api#TreeView
// https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
// https://code.visualstudio.com/api/references/vscode-api#TreeItem

import { Command } from "./commands"

/** Data model for hierarchial data rendered with TreeView */
export interface Tree {
  /**
   * Optional id for the tree item that has to be unique across tree.
   * The id is used to preserve the selection and expansion state of the tree item.
   */
  id: string

  /**
   * Icon name or actual icon node for the tree item. When falsy, the folder
   * icon is assigned if the item is collapsible. The file icon is assigned
   * if the item is not collapsible (leaf node).
   */
  icon?: string | React.ReactNode

  /** A human-readable string describing this item. */
  title: string

  /**
   * Ranges in the title to highlight. A range is defined as a tuple of two number
   * where the first is the inclusive start index and the second the exclusive end index.
   */
  highlights?: [number, number][]

  /** The Uri of the resource representing this item. Will be used to derive the label, when it is not provided. */
  resourceUri?: string

  /** The tooltip text when you hover over this item (optional). */
  tooltip?: string

  /** Item label badge, eg: children count, size, etc (optional) */
  badge?: string | number

  /** Tags shown for this item (optional) */
  tags?: string[]

  /** Commands shown as icons or in extension menu (optional) */
  commands?: Command[]

  /** Item's children (expand icon will be shown if array provided but empty) */
  children?: Tree[]
}
