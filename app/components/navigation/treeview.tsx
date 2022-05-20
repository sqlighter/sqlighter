//
// treeview.tsx - view used to shown hierachical information
//

import * as React from "react"
import { useState } from "react"

import Box from "@mui/material/Box"
import ButtonBase from "@mui/material/ButtonBase"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import { SxProps, Theme } from "@mui/material"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"

import { Command } from "../../lib/data/commands"
import { Tree } from "../../lib/data/tree"
import { Icon } from "../ui/icon"

const TREEITEM_STYLES: SxProps<Theme> = {
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

    ".TreeItem-commandIcon": {
      color: (theme) => theme.palette.text.disabled,
    },
  },

  ".TreeItem-collapsibleIcon": {
    minWidth: 20,
    width: 20,
    height: 20,
  },

  ".TreeItem-labelIcon": {
    width: 20,
    height: 20,
    marginRight: 0.5,
  },

  ".TreeItem-label": {
    fontWeight: "inherit",
    paddingRight: 0.5,
  },

  ".TreeItem-commandIcon": {
    width: 20,
    height: 20,
    color: "transparent",

    "&:hover": {
      color: (theme) => theme.palette.text.secondary,
    },
  },

  ".TreeItem-pinnedIcon": {
    color: (theme) => theme.palette.primary.main,
  },
}

const TREEITEM_NORESULTS_STYLES: SxProps = {
  minHeight: 24,
  maxHeight: 24,
  lineHeight: "24px",
  color: "text.secondary",
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

  /** True if item is rendered as expanded */
  expanded?: boolean

  /** True if item should be rendered as selected */
  selected?: boolean

  /** True if item should be rendered as pinned */
  pinned?: boolean

  /** Callback used when one of the action or "collapse/expand" icons is clicked */
  onCommand?: (event: React.SyntheticEvent, command: Command, item: Tree) => void
}

//
// TreeItem subcomponent
//

/** A component showing a tree item and its children (used by TreeView) */
function TreeItem({ item, ...props }: TreeItemProps) {
  /** An item is collapsible if it has an array of children (even if empty for now) */
  function isCollapsible(): boolean {
    return Array.isArray(item.children)
  }

  //
  // handlers
  //

  function handleItemClick(e) {
    console.debug("TreeItem.handleItemClick")
    if (isCollapsible()) {
      props.onCommand(e, { command: props.expanded ? "sqltr.collapseItem" : "sqltr.expandItem" }, item)
    }
  }

  function handleCommandClick(e, command) {
    console.debug(`TreeItem.handleCommandClick - ${command.command}`)
    e.stopPropagation()
    e.preventDefault()
    props.onCommand(e, command, item)
    return 0
  }

  //
  // render
  //

  const depthPadding = `${(props.depth || 0) * 8}px`

  function getCollapsibleIcon() {
    if (isCollapsible()) {
      if (props.expanded) {
        return <ArrowDropDownIcon className="TreeItem-collapsibleIcon" />
      } else {
        return <ArrowRightIcon className="TreeItem-collapsibleIcon" />
      }
    }
    return <Box className="TreeItem-collapsibleIcon" />
  }

  function getIcon() {
    const icon = item.icon ? item.icon : isCollapsible() ? "folder" : "file"
    return <Icon className="TreeItem-labelIcon">{icon}</Icon>
  }

  function getCommandIcon(command: Command) {
    let className = "TreeItem-commandIcon"
    if (props.pinned && command.command === "sqltr.pinItem") {
      className = " TreeItem-pinnedIcon"
    }

    return (
      <Icon
        key={command.command}
        className={className}
        onClick={(e) => {
          props.onCommand(e, command, item)
          e.stopPropagation()
        }}
      >
        {command.icon}
      </Icon>
    )
  }

  return (
    <>
      <ButtonBase sx={TREEITEM_STYLES} className="TreeItem-root" onClick={handleItemClick}>
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
        {item.commands && (
          <Stack className="TreeItem-commands" direction="row" spacing={0.5}>
            {item.commands.map((command) => getCommandIcon(command))}
          </Stack>
        )}
      </ButtonBase>
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

  /** Callback used when one of the item's commands is triggered */
  onCommand?: (event: React.SyntheticEvent, command: Command, item: Tree) => void
}

export function TreeView({ items, onCommand }: TreeViewProps) {
  //
  // state
  //

  // list of ids of items that are selected
  const [selected, setSelected] = useState<string[]>([])
  function isSelected(itemId: string): boolean {
    return selected.indexOf(itemId) !== -1
  }

  // list of ids of items that are expanded
  const [expanded, setExpanded] = useState<string[]>([])
  function isExpanded(itemId: string): boolean {
    return expanded.indexOf(itemId) !== -1
  }

  // list of ids of items that are pinned
  const [pinned, setPinned] = useState<string[]>([])
  function isPinned(itemId: string): boolean {
    return pinned.indexOf(itemId) !== -1
  }

  //
  // handlers
  //

  function handleCommand(event: React.SyntheticEvent, command: Command, item: Tree) {
    console.debug(`TreeView.handleActionClick - command: ${command.command}, item: ${item.id}`, command, item)

    switch (command.command) {
      case "sqltr.collapseItem":
        setExpanded(expanded.filter((expandedId) => item.id !== expandedId))
        break
      case "sqltr.expandItem":
        if (!isExpanded(item.id)) {
          setExpanded([...expanded, item.id])
        }
        break
      }

    if (onCommand) {
      onCommand(event, command, item)
    }
  }

  //
  // render
  //

  function renderChildren(children, depth) {
    if (children && children.length > 0) {
      return children.map((child) => renderItem(child, depth))
    } else {
      const marginLeft = `${(depth + 1) * 8 + 24}px`
      return (
        <Typography
        key="children1"
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

  function renderItem(item, depth) {
    const expanded = isExpanded(item.id)
    return (
      <>
        <TreeItem
          key={item.id}
          item={item}
          onCommand={handleCommand}
          expanded={expanded}
          selected={isSelected(item.id)}
          pinned={isPinned(item.id)}
          depth={depth}
        />
        {expanded && renderChildren(item.children, depth + 1)}
      </>
    )
  }

  return (
    <Box className="TreeView-root" sx={TREEVIEW_STYLES}>
      {items?.length > 0 && items.map((item) => renderItem(item, 0))}
    </Box>
  )
}
