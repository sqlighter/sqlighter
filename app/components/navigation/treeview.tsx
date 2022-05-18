//
// treeview.tsx - view used to shown hierachical information
//

import * as React from "react"
import { useState } from "react"

import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
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
import { SxProps } from "@mui/material"

import Badge from "@mui/material/Badge"
import ButtonBase from "@mui/material/ButtonBase"
//import Icon from "@mui/material/Icon"
import IconButton from "@mui/material/IconButton"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"

import { Tree } from "../../lib/data/tree"
import { Icon } from "../ui/icon"

/*
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
*/

const TREEITEM_HEIGHT = 26

const TREEITEM_STYLES: SxProps = {
  width: "100%",
  minHeight: 32,
  maxHeight: 32,
  paddingLeft: 0,
  paddingRight: 0.5,

  display: "flex",
  flexWrap: "nowrap",
  alignItems: "center",
  justifyContent: "start",
  textAlign: "start",

  "&:hover": {
    backgroundColor: "action.hover",
  },

  ".TreeItem-collapsibleIcon": {
    minWidth: 20,
    width: 20,
    height: 20,
  },

  ".TreeItem-icon": {
    width: 20,
    height: 20,
    marginRight: 0.5,
  },

  ".TreeItem-label": {
    fontWeight: "inherit",
    paddingRight: 0.5,
  },
}

const TREEITEM_NORESULTS_STYLES: SxProps = {
  minHeight: 24,
  maxHeight: 24,
  lineHeight: "24px",
  color: "text.secondary"
}

const TREEVIEW_STYLES: SxProps = {
  width: "100%",
  height: "100%",
  overflowY: "auto",

  ".MuiChip-root": {
    borderRadius: "4px",
    ".MuiChip-label": {
      fontSize: "0.6rem",
    },
  },
}

//
// TreeItem
//

export interface TreeItemProps {
  /** Item and children to be shown */
  item: Tree

  /** Depth in tree data (null or zero for root) */
  depth?: number

  /** Callback used when one of the action or "collapse/expand" icons is clicked */
  onActionClick?: (event: React.SyntheticEvent, item: Tree, action: string) => void
}

/** A component showing a tree item and its children (used by TreeView) */
function TreeItem({ item, onActionClick, depth }: TreeItemProps) {
  /** An item is collapsible if it has an array of children (even if empty for now) */
  function isCollapsible(): boolean {
    return Array.isArray(item.children)
  }

  //
  // handlers
  //

  function handleClick(e) {
    if (isCollapsible()) {
      const action = item.collapsibleState == "expanded" ? "collapse" : "expand"
      console.debug(`TreeView.handleClick - item.id: ${item.id}, action: ${action}`)
      onActionClick(e, item, action)
    }
  }

  //
  // render
  //

  const depthPadding = `${(depth || 0) * 8}px`

  function getCollapsibleIcon() {
    if (isCollapsible()) {
      if (item.collapsibleState == "expanded") {
        return <ArrowDropDownIcon className="TreeItem-collapsibleIcon" />
      } else {
        return <ArrowRightIcon className="TreeItem-collapsibleIcon" />
      }
    }
    return <Box className="TreeItem-collapsibleIcon" />
  }

  function getIcon() {
    const icon = item.icon ? item.icon : isCollapsible() ? "folder" : "file"
    return <Icon className="TreeItem-icon">{icon}</Icon>
  }

  function getChildren() {
    if (item.collapsibleState == "expanded") {
      if (item.children && item.children.length > 0) {
        return item.children.map((child, index) => {
          return (
            <TreeItem key={index + child.title} item={child} onActionClick={onActionClick} depth={(depth || 0) + 1} />
          )
        })
      } else {
        const marginLeft = `${(depth + 1) * 8 + 24}px`
        return (
          <Typography
            className="TreeItem-noResults"
            variant="body2"
            sx={TREEITEM_NORESULTS_STYLES}
            marginLeft={marginLeft}
          >
            No results
          </Typography>
        )
      }
    }
    return null
  }

  return (
    <>
      <ButtonBase sx={TREEITEM_STYLES} className="TreeItem-root" onClick={handleClick}>
        <Box className="TreeItem-depthPadding" sx={{ minWidth: depthPadding, width: depthPadding }} />
        {getCollapsibleIcon()}
        {getIcon()}
        <Typography className="TreeItem-label" variant="body2">
          {item.title}
        </Typography>
        {item.badge !== null && item.badge !== undefined && (
          <Chip className="TreeItem-badge" label={item.badge} size="small" />
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="caption" color="inherit">
          {item.tags && (
            <Stack className="TreeItem-tags" direction="row" spacing={0.5}>
              {item.tags.map((tag, index) => {
                return <Chip key={index} className="TreeItem-tag" label={tag} size="small" />
              })}
            </Stack>
          )}
        </Typography>
      </ButtonBase>
      {getChildren()}
    </>
  )
}

//
// TreeView
//

export interface TreeViewProps {
  /** Items to be shown in tree view */
  items?: Tree[]

  /** Will show filtered results based on given string */
  filter?: string

  /** Callback used when one of the item's actions or "collapse/expand" icons is clicked */
  onActionClick?: (event: React.SyntheticEvent, item: Tree, action: string) => void
}

export function TreeView({ items, onActionClick }: TreeViewProps) {
  // currently selected row (or rows)
  const [selection, setSelection] = useState<Tree[]>([])

  //
  // render
  //

  return (
    <Box className="TreeView-root" sx={TREEVIEW_STYLES}>
      {items?.length > 0 &&
        items.map((item, index) => {
          return <TreeItem key={index} item={item} onActionClick={onActionClick} />
        })}
    </Box>
  )
}
