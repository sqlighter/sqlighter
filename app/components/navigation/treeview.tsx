//
// treeview.tsx - view used to shown hierachical information
//

import * as React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { SxProps, Theme } from "@mui/material"

import { Command, CommandEvent } from "../../lib/commands"
import { useSettings } from "../hooks/usesettings"
import { Tree } from "../../lib/tree"
import { TreeItem, DEPTH_PADDING_PX } from "./treeitem"

/** Custom styles applied to TreeView and TreeItem components */
const TreeView_SxProps: SxProps<Theme> = {
  width: 1,
  //  height: 1,
  paddingRight: 0.75,
  overflow: "scroll",

  ".TreeItem-root": {
    width: 1,
    maxWidth: 1,
    minHeight: 36,
    maxHeight: 36,

    paddingLeft: 0,
    paddingRight: 1,

    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "start",
    textAlign: "start",
    color: "text.secondary",

    ".TreeItem-commands": {
      height: 18,
      display: "none",
    },

    "&:hover": {
      borderStartEndRadius: 16,
      borderEndEndRadius: 16,

      backgroundColor: "action.hover",
      color: "text.primary",

      // shown commands only on hover
      ".TreeItem-commands": {
        display: "flex",
      },

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

    // label includes title + optional description
    ".TreeItem-label": {
      minWidth: 80,
      fontWeight: "inherit",
      paddingRight: 0.5,
    },

    ".TreeItem-description": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontSize: "9px",
    },

    ".TreeItem-badge": {
      marginLeft: 0.5,
    },

    ".TreeItem-tags": {
      maxHeight: 24,
      maxWidth: 1,

      // show only the tags that
      display: "flex",
      justifyContent: "flex-end",
      flexWrap: "wrap",
      overflow: "hidden",

      ".MuiChip-root": {
        cursor: "pointer",
      },
    },

    ".TreeItem-commandIcon": {
      width: 18,
      height: 18,
      color: "transparent",
      "&:hover": {
        color: "primary.main",
      },
    },
  },

  // applied at the same level as TreeItem-root
  ".TreeItem-withDescription": {
    //alignItems: "start",
    minHeight: 40,
    maxHeight: 40,

    "&:hover": {
      borderStartEndRadius: 20,
      borderEndEndRadius: 20,
    },

    ".TreeItem-title": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      position: "relative",
      top: "2px",
    },
  },

  ".TreeItem-primary": {
    color: "text.primary",
  },

  ".TreeItem-selected": {
    backgroundColor: "primary.light",
  },

  ".TreeItem-noResults": {
    minHeight: 24,
    maxHeight: 24,
    lineHeight: "24px",
    color: "text.secondary",
    cursor: "default",
  },

  ".MuiTooltip-tooltipPlacementRight": {
    position: "relative",
    right: "400px",
  },
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

  /**
   * User preferences which can be stored in local storage or in the user
   * profile have a record for each itemId which tracks if the item is opened
   * or closed, pinned, and/or selected.
   */
  const [attributes, setAttributes] = useSettings<string[]>("treeview", [])

  function hasAttribute(itemId: string, attribute: string): boolean | undefined {
    return attributes[itemId]?.[attribute]
  }

  function setAttribute(itemId: string, attribute: string, value: boolean) {
    if (hasAttribute(itemId, attribute) != value) {
      const itemsAttrs = { ...attributes }
      const itemAttrs = itemsAttrs[itemId]
      if (typeof value == "boolean") {
        // setting to true or false sets the attribute
        if (!itemAttrs) {
          itemsAttrs[itemId] = { [attribute]: value }
        } else {
          itemAttrs[attribute] = value
        }
      } else {
        // setting to null or undefined removes the attribute
        if (itemAttrs) {
          delete itemAttrs[attribute]
          if (Object.keys(itemAttrs).length == 0) {
            delete itemsAttrs[itemId]
          }
        }
      }
      setAttributes(itemsAttrs)
    }
  }

  /** Item is pinned? */
  function isPinned(itemId: string): boolean {
    return Boolean(hasAttribute(itemId, "pinned"))
  }

  /** Remember if item is pinned */
  function setPinned(itemId: string, pinned: boolean) {
    setAttribute(itemId, "pinned", pinned ? true : undefined)
  }

  /** Item is expanded? */
  function isExpanded(itemId: string): boolean {
    const isExpanded = hasAttribute(itemId, "expanded")
    if (isExpanded === undefined) {
      // for the first/second level items, if the user has not closed
      // the item explicitly then we default to expanded so that the
      // first time a user sees a new tree view at least the first level
      // items are expanded by default
      const level = itemId.split("/").length
      return level < 3
    }
    return isExpanded
  }

  /** Remember if item is expanded */
  function setExpanded(itemId: string, expanded: boolean) {
    if (expanded) {
      setAttribute(itemId, "expanded", Boolean(expanded))
    } else {
      // for the first/second level items, we keep track if the user has
      // closed them explicitely so we can differentiate from the
      // item never having been closed or opened. for other levels
      // we just remove the attribute.
      const level = itemId.split("/").length
      setAttribute(itemId, "expanded", level < 3 ? false : undefined)
    }
  }

  /** Item is selected? */
  function isSelected(itemId: string): boolean {
    return hasAttribute(itemId, "selected")
  }
  /** Remember if item is selected */
  /*  
  function setSelected(itemId: string, expanded: boolean) {
    setAttribute(itemId, "selected", expanded)
  }
*/

  //
  // handlers
  //

  function handleCommand(event: React.SyntheticEvent, command: Command, item, renderingPins) {
    const pinnedId = renderingPins ? `pins/${item.id}` : item.id
    switch (command.command) {
      case "collapseTreeItem":
        setExpanded(pinnedId, false)
        return
      case "expandTreeItem":
        setExpanded(pinnedId, true)
        return
      case "pin":
        setPinned(item.id, !isPinned(item.id))
        return
    }
    if (props.onCommand) {
      props.onCommand(event, command)
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
        key={item.id}
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
            key={item.id + "-noResults"}
            className="TreeItem-noResults"
            variant="body2"
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
    <Box className="TreeView-root" sx={TreeView_SxProps}>
      {renderPinned()}
      {props.items?.length > 0 && props.items.map((item) => renderItem(item, 0, false))}
    </Box>
  )
}
