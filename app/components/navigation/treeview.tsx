//
// treeview.tsx - view used to shown hierachical information
//

import * as React from "react"
import { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { SxProps, Theme } from "@mui/material"

import { Command, CommandEvent } from "../../lib/commands"
import { useSettings } from "../hooks/useSettings"
import { Tree } from "../../lib/tree"
import { TreeItem, DEPTH_PADDING_PX } from "./treeitem"

/** Custom styles applied to TreeView and TreeItem components */
const TREEVIEW_STYLES: SxProps<Theme> = {
  width: "100%",
  height: "100%",

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

  ".MuiChip-root": {
    cursor: "pointer",
    borderRadius: "4px",
    ".MuiChip-label": {
      fontSize: "0.6rem",
    },
  },
}

const TREEITEM_NORESULTS_STYLES: SxProps = {
  minHeight: 24,
  maxHeight: 24,
  lineHeight: "24px",
  color: "text.secondary",
}

export interface TreeViewProps {
  /** Items to be shown in tree view */
  items?: Tree[]

  /** Will show filtered results based on given string */
  filter?: string

  /** Callback used when one of the item's commands is triggered */
  onCommand?: CommandEvent
}

export function TreeView(props: TreeViewProps) {
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

  // list of ids of pinned items
  const [pins, setPins] = useSettings<string[]>("pins", [])
  function isPinned(itemId: string): boolean {
    return pins.indexOf(itemId) !== -1
  }
  function setPinned(itemId: string, pinned: boolean) {
    if (isPinned(itemId) != pinned) {
      if (pinned) {
        setPins([...pins, itemId])
      } else {
        setPins(pins.filter((p) => p != itemId))
      }
    }
  }

  //
  // handlers
  //

  function handleCommand(event: React.SyntheticEvent, command: Command, item, renderingPins) {
    const pinnedId = renderingPins ? `pins/${item.id}` : item.id
    console.debug(`TreeView.handleCommand - ${command}`)

    switch (command.command) {
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
        if (props.onCommand) {
          props.onCommand(event, command)
        }
    }
  }

  //
  // render
  //

  /**
   * Renders a treeview item and its children
   * @param item Data model for the item to be rendered
   * @param depth Hierarchical depth, root is zero
   * @param renderingPins True if we're rendering the pinned items section
   * @returns An array of fragments, one for each node item
   */
  function renderItem(item, depth, renderingPins) {
    const expanded = isExpanded(renderingPins ? `pins/${item.id}` : item.id)
    const pinned = isPinned(item.id)

    const fragments = []
    fragments.push(
      <TreeItem
        item={item}
        onCommand={(e, command) => handleCommand(e, command, item, renderingPins)}
        expanded={expanded}
        selected={isSelected(item.id)}
        pinned={pinned}
        depth={depth}
      />
    )

    if (expanded) {
      if (item.children && item.children.length > 0) {
        // render each node's child and his children
        for (const child of item.children) {
          const childFragments = renderItem(child, depth + 1, renderingPins)
          fragments.push(childFragments)
        }
      } else {
        // render "no results" if node is expanded but has no children
        const marginLeft = `${(depth + 1) * DEPTH_PADDING_PX + 24}px`
        fragments.push(
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

    return fragments
  }

  /** Scan tree looking for items that have been pinned. If found, create a 'Pinned' section. */
  function renderPinned() {
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
    getPinnedItems(props.items, pinnedItems)
    if (pinnedItems.length > 0) {
      pinnedItems = [
        {
          id: `pins`, // TODO should be specific to connection/database?
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
      {renderPinned()}
      {props.items?.length > 0 && props.items.map((item) => renderItem(item, 0, false))}
    </Box>
  )
}
