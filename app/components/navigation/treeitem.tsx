//
// treeitem.tsx - renders a node item in a treeview component
//

import * as React from "react"

import Box from "@mui/material/Box"
import ButtonBase from "@mui/material/ButtonBase"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"

import { Command, CommandEvent } from "../../lib/commands"
import { Tree } from "../../lib/tree"
import { Icon } from "../ui/icon"

// delay before showing tooltips
const TOOLTIP_ENTER_DELAY_MS = 1000

// pixels of indentation for each hierarchical level
export const DEPTH_PADDING_PX = 12

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
  onCommand?: CommandEvent
}

//
// TreeItem subcomponent
//

/** A component showing a tree item and its children (used by TreeView) */
export function TreeItem({ item, ...props }: TreeItemProps) {
  /** An item is collapsible if it has an array of children (even if empty for now) */
  function isCollapsible(): boolean {
    return Array.isArray(item.children)
  }

  //
  // handlers
  //

  function handleItemClick(e) {
    if (isCollapsible()) {
      props.onCommand(e, {
        command: props.expanded ? "sqlighter.collapseItem" : "sqlighter.expandItem",
        args: { item },
      })
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
    // alter pin command for items that are already pinned
    if (props.pinned && command.command === "sqlighter.pin") {
      command.title = "Unpin"
      command.icon = "unpin"
    }

    // NOTE the <Box> inside Tooltip is necessary since Icon is a passive element that doesn't fire events (unlike IconButton)
    return (
      <Tooltip
        key={command.command}
        className="TreeItem-commandIconTooltip"
        title={command.title}
        placement="top"
        enterDelay={TOOLTIP_ENTER_DELAY_MS}
      >
        <Box>
          <Icon
            className="TreeItem-commandIcon"
            onClick={(e) => {
              //              props.onCommand(e, command.command, { item, command })
              props.onCommand(e, command)
              e.stopPropagation()
            }}
          >
            {command.icon}
          </Icon>
        </Box>
      </Tooltip>
    )
  }

  /** A tag is rendered as a chip with an optional tooltip */
  function getTag(tag, index) {
    if (typeof tag === "string") {
      return (
        <Tooltip key={index} title={tag}>
          <Chip className="TreeItem-tag" label={tag} size="small" component="span" />
        </Tooltip>
      )
    }
    return (
      <Tooltip key={index} title={tag.tooltip}>
        <Chip className="TreeItem-tag" label={tag.title} size="small" component="span" />
      </Tooltip>
    )
  }

  return (
    <ButtonBase className={itemClass} onClick={handleItemClick}>
      <Box className="TreeItem-depthPadding" sx={{ minWidth: depthPadding, width: depthPadding }} />
      {getCollapsibleIcon()}
      {item.icon && getIcon()}
      <Tooltip className="TreeItem-labelTooltip" title={item.title}>
        <Typography className="TreeItem-label" variant="body2" color="inherit" noWrap>
          {item.title}
          {item.badge !== null && item.badge !== undefined && (
            <Chip className="TreeItem-badge" label={item.badge} size="small" component="span" />
          )}
        </Typography>
      </Tooltip>
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
