//
// HistoryActivity.tsx - sidebar activity with queries history
//

import { Theme, SxProps } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { Command } from "../../lib/commands"
import { Query } from "../../lib/items/query"

import { PanelProps } from "../navigation/panel"
import { Tree } from "../../lib/tree"
import { TreeView } from "../navigation/treeview"

// Styles applied to component and subcomponents
export const HistoryActivity_SxProps: SxProps<Theme> = {
  ".HistoryActivity-header": {
    width: 1,
    padding: 1,
  },
}

export interface HistoryActivityProps extends PanelProps {
  /** List of recent queries shown in history activity */
  queries: Query[]
}

/** A sidebar panel used to display the query history */
export function HistoryActivity(props: HistoryActivityProps) {
  // create history tree with items, commands, etc
  const historyTrees = getHistoryTrees(props.queries)

  //
  // handlers
  //

  function handleCommand(event, command: Command) {
    console.debug(`HistoryActivity.handleCommand: ${command.command}`, command)
    switch (command.command) {
      case "clickTreeItem":
        // open a query panel when an item is clicked
        const query = command?.args?.item?.args?.query as Query
        if (query) {
          props.onCommand(event, {
            command: "openQuery",
            args: query,
          })
        }
        return
    }

    if (props.onCommand) {
      props.onCommand(event, command)
    }
  }

  return (
    <Box className="HistoryActivity-root" sx={HistoryActivity_SxProps}>
      <Box className="HistoryActivity-header">
        <Typography variant="overline">{props.title}</Typography>
      </Box>
      <TreeView items={historyTrees} onCommand={handleCommand} />
    </Box>
  )
}

//
//
//

function _getHistoryItems(queries: Query[]): Tree[] {
  const items: Tree[] = []

  return queries?.map((query, index) => {
    return {
      id: `${index}/tables`,
      title: query.sql,
      type: "query",
      icon: "code",
      // badge: tables?.length > 0 ? tables.length.toString() : "0",
      // children: tables?.length > 0 && tables,
      args: { query },
    }
  })
}

/** Convers a list of queries into a Tree of items that can be shown by TreeView */
export function getHistoryTrees(queries: Query[], filter?: string): Tree[] {
  const today: Tree = {
    id: "history/today",
    title: "Today",
    type: "history",
    icon: "history",
    commands: [
      { command: "openDatabase", icon: "info", title: "View Structure", args: {} },
      { command: "refreshSchema", icon: "refresh", title: "Refresh Schema" },
    ],
    children: _getHistoryItems(queries),
  }

  const earlier: Tree = {
    id: "history/earlier",
    title: "Earlier",
    type: "history",
    icon: "history",
    commands: [
      { command: "openDatabase", icon: "info", title: "View Structure", args: {} },
      { command: "refreshSchema", icon: "refresh", title: "Refresh Schema" },
    ],
    children: _getHistoryItems(queries),
  }

  return [today, earlier]
}
