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

import { useSettings } from "../hooks/useSettings"
import { Command } from "../../lib/data/commands"
import { Tree } from "../../lib/data/tree"
import { Icon } from "../ui/icon"

// delay before showing tooltips
const TOOLTIP_ENTER_DELAY_MS = 1000

const TREEVIEW_STYLES: SxProps<Theme> = {
  width: "100%",
  height: "100%",

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
      marginLeft: 0.5,
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
      "&:hover": {
        color: (theme) => theme.palette.primary.main,
      },
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
  onCommand?: (event: React.SyntheticEvent, command: string, args) => void
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
      props.onCommand(e, props.expanded ? "sqlighter.collapseItem" : "sqlighter.expandItem", { item })
    }
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
    if (props.pinned) {
      console.debug(`getCommandIcon - ${item.id} is pinned`)
    }

    let commandClass = "TreeItem-commandIcon"
    let commandIcon = command.icon
    if (props.pinned && command.command === "sqlighter.pin") {
      commandClass += " TreeItem-pinnedIcon"
      commandIcon = "pinned"
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
            className={commandClass}
            onClick={(e) => {
              props.onCommand(e, command.command, { item, command })
              e.stopPropagation()
            }}
          >
            {commandIcon}
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
  onCommand?: (event: React.SyntheticEvent, command: string, args) => void
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
  const [pins, setPins] = useSettings("sqlighter.pinned", {})
  function isPinned(itemId: string): boolean {
    return !!pins[itemId]
  }
  function setPinned(itemId: string, pinned: boolean) {
    const updated = Object.assign({}, pins)
    updated[itemId] = pinned
    setPins(updated)
    console.debug(`TreeView.setPinned - itemId: ${itemId}, pinned: ${pinned}`, pins)
  }

  //
  // handlers
  //

  function handleCommand(event: React.SyntheticEvent, command: string, args, renderingPins) {
    const item = args.item
    const pinnedId = renderingPins ? `pins/${item.id}` : item.id
    console.debug(`TreeView.handleCommand - ${command}`, args)

    switch (command) {
      case "sqlighter.collapseItem":
        setExpanded(expanded.filter((expandedId) => pinnedId !== expandedId))
        break
      case "sqlighter.expandItem":
        console.debug(`TreeView.handleCommand - ${command}, ${pinnedId}, isExpanded: ${isExpanded(pinnedId)}`)
        if (!isExpanded(pinnedId)) {
          setExpanded([...expanded, pinnedId])
        }
        break

      case "sqlighter.pin":
        setPinned(item.id, !isPinned(item.id))
        break

      default:
        if (onCommand) {
          onCommand(event, command, args)
        }
    }
  }

  //
  // render
  //

  function renderChildren(children, depth, renderingPins) {
    if (children && children.length > 0) {
      return children.map((child) => renderItem(child, depth, renderingPins))
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

  /**
   * Renders a treeview item
   * @param item Data model for the item to be rendered
   * @param depth Hierarchical depth, root is zero
   * @param renderingPins True if we're rendering the pinned items section
   */
  function renderItem(item, depth, renderingPins) {
    const expanded = isExpanded(renderingPins ? `pins/${item.id}` : item.id)
    const pinned = isPinned(item.id)
    return (
      <>
        <TreeItem
          key={item.id}
          item={item}
          onCommand={(e, command, args) => handleCommand(e, command, args, renderingPins)}
          expanded={expanded}
          selected={isSelected(item.id)}
          pinned={pinned}
          depth={depth}
        />
        {expanded && renderChildren(item.children, depth + 1, renderingPins)}
      </>
    )
  }

  /** Scan tree looking for items that have been pinned. If found, create a 'Pinned' section. */
  function renderPins() {
    function getPinnedItems(items, pinnedItems) {
      for (const item of items) {
        if (isPinned(item.id)) {
          pinnedItems.push(item)
        }
        if (item.children) {
          getPinnedItems(item.children, pinnedItems)
        }
      }
    }

    // search for pinned items and if found add a "Pinned" section to the treeview
    let pinnedItems = []
    getPinnedItems(items, pinnedItems)
    if (pinnedItems.length > 0) {
      pinnedItems = [
        {
          id: `pins`,
          title: "Pinned",
          type: "pins",
          icon: "pin",
          badge: pinnedItems.length.toString(),
          children: pinnedItems,
        },
      ]
    }

    if (pinnedItems.length > 0) {
      return pinnedItems.map((item) => renderItem(item, 0, true))
    }
    return null
  }

  return (
    <Box className="TreeView-root" sx={TREEVIEW_STYLES}>
      {renderPins()}
      {items?.length > 0 && items.map((item) => renderItem(item, 0, false))}
    </Box>
  )
}
