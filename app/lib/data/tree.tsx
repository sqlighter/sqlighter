//
// tree.tsx - data model for hierachical information often shown using TreeView
//

import * as React from "react"
import PropTypes from "prop-types"
import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import MuiTreeView from "@mui/lab/TreeView"
import MuiTreeItem, { treeItemClasses as muiTreeItemClasses } from "@mui/lab/TreeItem"
import Typography from "@mui/material/Typography"
import MailIcon from "@mui/icons-material/Mail"
import DeleteIcon from "@mui/icons-material/Delete"
import Label from "@mui/icons-material/Label"
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount"
import InfoIcon from "@mui/icons-material/Info"
import ForumIcon from "@mui/icons-material/Forum"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"

import Badge from "@mui/material/Badge"
import Icon from "@mui/material/Icon"
import IconButton from "@mui/material/IconButton"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import QuestionMarkIcon from "@mui/icons-material/QuestionMarkOutlined"
import DatabaseIcon from "@mui/icons-material/StorageOutlined"
import TableIcon from "@mui/icons-material/TableChartOutlined"

// NOTE where possible we try using APIs similar to vscode
// https://code.visualstudio.com/api/extension-guides/tree-view
// https://code.visualstudio.com/api/references/vscode-api#TreeView
// https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider

/**
 * Data model representing a single item or an entire tree hierarchy with multiple 
 * levels of children to be displayed using TreeView/TreeItem components.
 */

// https://code.visualstudio.com/api/references/vscode-api#TreeItem
export interface Tree {
  /** 
   * Optional id for the tree item that has to be unique across tree. 
   * The id is used to preserve the selection and expansion state of the tree item.
   * If not provided, an id is generated using the tree item's label. Note that 
   * when labels change, ids will change and that selection and expansion state 
   * cannot be kept stable anymore.
   */
  id?: string

  /** 
   * Icon name or actual icon node for the tree item. When falsy, the folder 
   * icon is assigned if the item is collapsible. The file icon is assigned 
   * if the item is not collapsible (leaf node). 
   */
  icon?: string | React.ReactNode

  /** A human-readable string describing this item. */
  title: string

  /** Ranges in the title to highlight. A range is defined as a tuple of two number where the first is the inclusive start index and the second the exclusive end index. */
  highlights?: [number, number][]

  /** The Uri of the resource representing this item. Will be used to derive the label, when it is not provided. */
  resourceUri?: string

  /** The tooltip text when you hover over this item (optional). */
  tooltip?: string

  /** Item label badge, eg: children count, size, etc (optional) */
  badge?: string | number

  /** Tags shown for this item (optional) */
  tags?: string[]

  /** Item is currently collapsed, expanded (collapsed when not specified) */
  collapsibleState?: "expanded" | "collapsed"

  /** Item's children (expand icon will be shown if array provided but empty) */
  children?: Tree[]
}
