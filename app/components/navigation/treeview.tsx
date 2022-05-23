//
// treeview.tsx - view used to shown hierachical information
//

import * as React from "react"
import { useState } from "react"

import Box from "@mui/material/Box"
import ButtonBase from "@mui/material/ButtonBase"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"

import { SxProps, Theme } from "@mui/material"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"

import { Command } from "../../lib/data/commands"
import { Tree } from "../../lib/data/tree"
import { Icon } from "../ui/icon"

// delay before showing tooltips
const TOOLTIP_ENTER_DELAY_MS = 1000

const TREEVIEW_STYLES: SxProps<Theme> = {
  width: "100%",
  height: "100%",
  //  overflowY: "auto",

  ".MuiChip-root": {
    borderRadius: "4px",
    ".MuiChip-label": {
      fontSize: "0.6rem",
    },
  },

  ".TreeItem-root": {
    width: "100%",
    maxWidth: "100%",
    minHeight: 32,
    maxHeight: 32,
    //  overflowX: "hidden",

    paddingLeft: 0,
    paddingRight: 0.5,

    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "start",
    textAlign: "start",
    color: "text.secondary",

    "&:hover": {
      backgroundColor: "action.hover",
      color: "text.primary",

      ".TreeItem-commandIcon": {
        color: (theme) => theme.palette.text.disabled,
      },
    },

    ".TreeItem-collapsibleIcon": {
      minWidth: 16,
      width: 16,
      height: 16,
      marginLeft: 1,
    },

    ".TreeItem-labelIcon": {
      width: 18,
      height: 18,
      marginRight: 0.5,
    },

    ".TreeItem-label": {
      minWidth: 64,
      overflow: "hidden",
      textOverflow: "ellipsis",

      fontWeight: "inherit",
      paddingRight: 0.5,
    },

    ".TreeItem-badge": {
      marginLeft: 0.5,
    },

    ".TreeItem-tags": {
      maxWidth: "100%",
      overflow: "hidden",
    },

    ".MuiChip-root": {
      cursor: "pointer",
    },

    ".TreeItem-commands": {
      height: 18,
    },

    ".TreeItem-commandIcon": {
      width: 18,
      height: 18,
      color: "transparent",

      "&:hover": {
        color: (theme) => theme.palette.text.secondary,
      },
    },

    ".TreeItem-pinnedIcon": {
      color: (theme) => theme.palette.primary.main,
    },
  },

  ".TreeItem-primary": {
    color: "text.primary",
  },

  ".TreeItem-selected": {
    backgroundColor: "primary",
  },
}

const TREEITEM_NORESULTS_STYLES: SxProps = {
  minHeight: 24,
  maxHeight: 24,
  lineHeight: "24px",
  color: "text.secondary",
}

//
// TreeItem
//

// pixels of indentation for each hierarchical level
const DEPTH_PADDING_PX = 12

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

  const depthPadding = `${(props.depth || 0) * DEPTH_PADDING_PX}px`
  let itemClass = "TreeItem-root"
  if (props.depth == 0) {
    itemClass += " TreeItem-primary"
  }

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

    // NOTE the <div> inside Tooltip is necessary since Icon is a passive element that doesn't fire events (unlike IconButton)
    return (
      <Tooltip
        key={command.command}
        className="TreeItem-commandIconTooltip"
        title={command.title}
        placement="top"
        enterDelay={TOOLTIP_ENTER_DELAY_MS}
      >
        <div>
          <Icon
            className={className}
            onClick={(e) => {
              props.onCommand(e, command, item)
              e.stopPropagation()
            }}
          >
            {command.icon}
          </Icon>
        </div>
      </Tooltip>
    )
  }

  /** A tag is rendered as a chip with an optional tooltip */
  function getTag(tag, index) {
    if (typeof tag === "string") {
      return <Chip key={index} className="TreeItem-tag" label={tag} size="small" />
    }
    return (
      <Tooltip key={index} title={tag.tooltip} placement="top" enterDelay={TOOLTIP_ENTER_DELAY_MS}>
        <Chip className="TreeItem-tag" label={tag.title} size="small" />
      </Tooltip>
    )
  }

  return (
    <ButtonBase className={itemClass} onClick={handleItemClick}>
      <Box className="TreeItem-depthPadding" sx={{ minWidth: depthPadding, width: depthPadding }} />
      {getCollapsibleIcon()}
      {item.icon && getIcon()}
      <Typography className="TreeItem-label" variant="body2" color="inherit">
        {item.title}
        {item.badge !== null && item.badge !== undefined && (
          <Chip className="TreeItem-badge" label={item.badge} size="small" />
        )}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      {item.tags && (
        <Stack className="TreeItem-tags" direction="row" spacing={0.5}>
          {item.tags.map((tag, index) => getTag(tag, index))}
        </Stack>
      )}
      {item.commands && (
        <Stack className="TreeItem-commands" direction="row" spacing={0.5}>
          {item.commands.map((command) => getCommandIcon(command))}
        </Stack>
      )}
    </ButtonBase>
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
