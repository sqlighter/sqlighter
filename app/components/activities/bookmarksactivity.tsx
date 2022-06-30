//
// BookmarksActivity.tsx - sidebar activity with bookmarked queries
//

import { Theme, SxProps } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { Command } from "../../lib/commands"
import { Query } from "../../lib/items/query"

import { Empty } from "../ui/empty"
import { PanelProps } from "../navigation/panel"
import { SigninButton } from "../auth/signinbutton"
import { Tree } from "../../lib/tree"
import { TreeView } from "../navigation/treeview"

export const BOOKMARKS_TITLE = "Bookmarks"
export const BOOKMARKS_FOLDER = "My Queries"

// Styles applied to component and subcomponents
export const BookmarksActivity_SxProps: SxProps<Theme> = {
  ".BookmarksActivity-header": {
    width: 1,
    padding: 1,
  },
}

export interface BookmarksActivityProps extends PanelProps {
  /** List of bookmarked queries shown in activity panel, if empty array shows empty list, if undefined show <Empty> component */
  queries: Query[]
}

/** A sidebar panel used to display bookmarked queries */
export function BookmarksActivity(props: BookmarksActivityProps) {
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

  //
  // render
  //

  /** Returns an empty state or your bookmarks as a TreeView */
  function renderItems() {
    //
    //<GoogleSigninButton />

    if (!props.queries) {
      return (
        <Empty title="No bookmarks yet" icon="bookmark">
          <SigninButton onCommand={props.onCommand} />
        </Empty>
      )
    }
    const bookmarksTrees = getBookmarksTrees(props.queries)
    return <TreeView items={bookmarksTrees || []} onCommand={handleCommand} />
  }

  return (
    <Box className="BookmarksActivity-root" sx={BookmarksActivity_SxProps}>
      <Box className="BookmarksActivity-header">
        <Typography variant="overline">{props.title}</Typography>
      </Box>
      {renderItems()}
    </Box>
  )
}

//
// Utilities
//

function getQueriesAsTreeItems(rootId: string, queries: Query[]): Tree[] {
  return queries?.map((query, index) => {
    return {
      id: `${rootId}/${query.id}_${index}`,
      title: query.title,
      description: query.sql,
      tooltip: query.sql,
      type: "query",
      icon: "query",
      commands: [
        { command: "openQuery", icon: "query", title: "Open Query", args: query },
        { command: "deleteBookmarks", icon: "delete", title: "Delete", args: { queries: [query] } },
      ],
      args: { query },
    }
  })
}

/** Convers a list of queries into a Tree of items that can be shown by TreeView */
export function getBookmarksTrees(queries?: Query[]): Tree[] {
  // sorted list of folders for these queries
  let folders
  if (queries?.length > 0) {
    folders = queries
      .map((q) => q.folder || BOOKMARKS_FOLDER) // map to folder name
      .filter((value, index, self) => self.indexOf(value) === index) // unique only
      .sort((a, b) => a.localeCompare(b)) // sort alphabetically
  }
  if (!folders || folders.length < 1) {
    folders = [BOOKMARKS_FOLDER]
  }

  const trees: Tree[] = []
  for (const folder of folders) {
    // sort queries by query title
    const folderQueries = queries
      ?.filter((q) => (q.folder || BOOKMARKS_FOLDER) === folder)
      .sort((a, b) => a.title.localeCompare(b.title))

    const folderId = `bookmarks/${folder.toLowerCase()}`
    trees.push({
      id: folderId,
      title: folder,
      type: "bookmarks",
      icon: "bookmark",
      commands: [
        folderQueries?.length > 0 && {
          command: "deleteBookmarks",
          icon: "delete",
          title: "Delete",
          args: { queries: folderQueries },
        },
      ],
      badge: folderQueries?.length > 0 ? folderQueries.length.toString() : "0",
      // pass empty array even if there are no queries so we get the "No results" label
      children: folderQueries?.length > 0 ? getQueriesAsTreeItems(folderId, folderQueries) : [],
    })
  }

  return trees
}
