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
  //
  // state
  //

  // tooltip is shared between main item button, tags and command icons
  const [tooltip, setTooltip] = React.useState<string>()

  /** An item is collapsible if it has an array of children (even if empty for now) */
  function isCollapsible(): boolean {
    return Array.isArray(item.children)
  }

  //
  // handlers
  //

  /** Open or close items that are collapsible or just propagate click command */
  function handleItemClick(event) {
    if (props.onCommand) {
      props.onCommand(event, {
        command: isCollapsible() ? (props.expanded ? "collapseTreeItem" : "expandTreeItem") : "clickTreeItem",
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
  if (item.description) {
    itemClass += " TreeItem-withDescription"
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

  function getCommandIcon(command: Command, key) {
    // alter pin command for items that are already pinned
    if (props.pinned && command.command === "pin") {
      command.title = "Unpin"
      command.icon = "unpin"
    }

    return (
      <Icon
        key={key}
        className="TreeItem-commandIcon"
        onClick={(e) => {
          props.onCommand(e, command)
          e.stopPropagation()
        }}
        onMouseEnter={() => setTooltip(command.title as string)}
        onMouseLeave={() => setTooltip(undefined)} // back to item's tooltip
      >
        {command.icon}
      </Icon>
    )
  }

  /** A tag is rendered as a chip with an optional tooltip */
  function getTag(tag, key) {
    if (typeof tag === "string") {
      return (
        <Chip
          key={key}
          className="TreeItem-tag"
          label={tag}
          size="small"
          component="span"
          onMouseEnter={() => setTooltip(tag)}
          onMouseLeave={() => setTooltip(undefined)}
        />
      )
    }
    return (
      <Chip
        key={key}
        className="TreeItem-tag"
        label={tag.title}
        size="small"
        component="span"
        onMouseEnter={() => setTooltip(tag.tooltip)}
        onMouseLeave={() => setTooltip(undefined)}
      />
    )
  }

  function renderTitle(item) {
    if (item.description) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box className="TreeItem-title">{item.title}</Box>
          <Typography className="TreeItem-description" variant="caption">
            {item.description}
          </Typography>
        </Box>
      )
    }
    return item.title
  }

  // specific field for tooltip is preferred if specified
  // a single tooltip placed out of the way on the right
  // is shared between the item, its tags and its commands
  // so that the tooltip doesn't keep opening/closing
  return (
    <Tooltip className="TreeItem-labelTooltip" title={tooltip || item.tooltip || item.title} placement="right">
      <ButtonBase className={itemClass} onClick={handleItemClick}>
        <Box className="TreeItem-depthPadding" sx={{ minWidth: depthPadding, width: depthPadding }} />
        {getCollapsibleIcon()}
        {item.icon && getIcon()}
        <Typography className="TreeItem-label" variant="body2" color="inherit" noWrap component="div">
          {renderTitle(item)}
          {item.badge !== null && item.badge !== undefined && (
            <Chip className="TreeItem-badge" label={item.badge} size="small" component="span" />
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
            {item.commands.map((command, index) => getCommandIcon(command, index))}
          </Stack>
        )}
      </ButtonBase>
    </Tooltip>
  )
}
