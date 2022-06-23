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
  //
  // handlers
  //

  function handleCommand(event, command: Command) {
    switch (command.command) {
      // open query when item is clicked
      case "clickTreeItem":
        const query = command?.args?.item?.args?.query as Query
        if (query) {
          props.onCommand(event, { command: "openQuery", args: query })
        }
        return
    }

    if (props.onCommand) {
      props.onCommand(event, command)
    }
  }

  // create history tree with items, commands, etc
  const historyTrees = getHistoryTrees(props.queries)

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
// utility methods
//

function _getHistoryItems(queries: Query[], rootId: string): Tree[] {
  return queries?.map((query, index) => {
    return {
      id: `${rootId}/${index}`,
      title: query.title,
      description: query.sql,
      tooltip: query.sql,
      type: "query",
      icon: "query",
      commands: [
        { command: "openQuery", icon: "query", title: "Open Query", args: query },
        { command: "deleteQuery", icon: "delete", title: "Delete", args: query },
      ],
      args: { query },
    }
  })
}

/** Convers a list of queries into a Tree of items that can be shown by TreeView */
export function getHistoryTrees(queries?: Query[]): Tree[] {
  const today = new Date().toISOString().split("T")[0] // eg. 2022-06-23 from 2022-06-23T16:11:23.000Z
  const todayQueries = queries?.filter((query) => {
    return (query.updatedAt || query.createdAt)?.toISOString().split("T")[0] >= today
  })

  const tree: Tree[] = [
    {
      id: "history/today",
      title: "Today",
      type: "history",
      icon: "olderHistory",
      commands: [
        todayQueries?.length > 0 && { command: "deleteQueries", icon: "delete", title: "Delete", args: todayQueries },
      ],
      badge: todayQueries?.length > 0 ? todayQueries.length.toString() : "0",
      // pass empty array even if there are no queries so we get the "No results" label
      children: todayQueries ? _getHistoryItems(todayQueries, "history/today") : [],
    },
  ]

  // older queries?
  const earlierQueries = queries?.filter((query) => {
    return (query.updatedAt || query.createdAt)?.toISOString().split("T")[0] < today
  })
  if (earlierQueries?.length > 0) {
    tree.push({
      id: "history/earlier",
      title: "Earlier",
      type: "history",
      icon: "bedtime",
      commands: [{ command: "deleteQueries", icon: "delete", title: "Delete", args: earlierQueries }],
      badge: earlierQueries?.length > 0 ? earlierQueries.length.toString() : "0",
      children: _getHistoryItems(earlierQueries, "history/earlier"),
    })
  }

  return tree
}
