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

export interface TreeIconProps {
  children: string | React.ReactNode
}

export function TreeIcon({ children }: TreeIconProps) {
  if (typeof children === "string") {
    switch (children) {
      case "database":
        return <DatabaseIcon />
      case "table":
        return <TableIcon />
      default:
        return <QuestionMarkIcon />
    }
  }

  return <>NO: {children}</>
}

const StyledTreeItemRoot = styled(MuiTreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${muiTreeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: "var(--tree-view-color)",
    },
    [`& .${muiTreeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit",
    },
  },
  [`& .${muiTreeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${muiTreeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}))

/**
 * Data model representing a single item possibly with children nodes,
 * or even a whole tree to be shown be TreeView/TreeItem components.
 */
export interface TreeData {
  /** Item's unique id used by parent to track actions, changes, etc */
  id?: string

  /** Icon to be shown before title (optional) */
  icon?: string | React.ReactNode

  /** Item's title */
  title: string

  /** Item counter badge (optional) */
  counter?: number

  /** Tags shown for this item (optional) */
  tags?: string[]

  /** Item is currently collapsed, expanded (collapsed when not specified) */
  collapsibleState?: "expanded" | "collapsed"

  /** Item's children (expand icon will be shown if array provided but empty) */
  children?: TreeData[]
}

export interface TreeItemProps extends TreeData {
  /** Item and children to be shown */
  item: TreeData

  /** Callback used when one of the action or "collapse/expand" icons is clicked */
  onActionClick?: (event: React.SyntheticEvent, item: TreeData, action: string) => void
}

function TreeItem({ item, onActionClick }: TreeItemProps) {
  //
  // handlers
  //

  function handleCollapsibleIconClick(e) {
    if (onActionClick) {
      const action = item.collapsibleState == "expanded" ? "collapse" : "expand"
      console.debug(`TreeView.handleCollapsibleIconClick - item.id: ${item.id}, action: ${action}`)
      onActionClick(e, item, action)
    }
  }

  //
  // render
  //

  function getCollapsibleIcon() {
    if (item.children) {
      const icon = item.collapsibleState == "expanded" ? <ArrowDropDownIcon /> : <ArrowRightIcon />
      return (
        <IconButton size="small" onClick={handleCollapsibleIconClick}>
          {icon}
        </IconButton>
      )
    }
    return <Box width={40} />
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
        {getCollapsibleIcon()}
        {item.icon && <TreeIcon>{item.icon}</TreeIcon>}
        <Typography variant="body2" sx={{ fontWeight: "inherit", flexGrow: 1 }}>
          {item.title} {item.counter > 0 && <Badge badgeContent={item.counter} color="primary" />}
        </Typography>
        <Typography variant="caption" color="inherit">
          {item.tags && (
            <Stack direction="row" spacing={0.5}>
              {item.tags.map((tag, index) => {
                return <Chip label={tag} size="small" />
              })}
            </Stack>
          )}
        </Typography>
      </Box>
      {item.children !== undefined && item.collapsibleState == "expanded" && (
        <Box sx={{ marginLeft: 2 }}>
          {item.children &&
            item.children.map((child, index) => {
              return <TreeItem key={index + child.title} item={child} onActionClick={onActionClick} />
            })}
        </Box>
      )}
    </>
  )
}

export interface TreeViewProps {
  /** Items to be shown in tree view */
  items?: TreeData[]

  /** Will show filtered results based on given string */
  filter?: string

  /** Callback used when one of the item's actions or "collapse/expand" icons is clicked */
  onActionClick?: (event: React.SyntheticEvent, item: TreeData, action: string) => void
}

export function TreeView({ items, onActionClick }: TreeViewProps) {
  //
  // handlers
  //

  //
  // render
  //

  return (
    <Box sx={{ width: "100%", height: "100%", overflowY: "auto" }}>
      {items?.length > 0 &&
        items.map((item, index) => {
          return <TreeItem key={index} item={item} onActionClick={onActionClick} />
        })}
    </Box>
  )
}
