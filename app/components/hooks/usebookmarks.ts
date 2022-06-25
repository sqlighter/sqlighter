//
// useBookmarks.ts - a hook to easily access bookmarked queries
//

import { useItems } from "./useitems"
import { Query } from "../../lib/items/query"

/** A hook to retrieve and modify queries that have been bookmarked on the server */
export function useBookmarks() {
  const props = useItems<Query>("/api/queries")
  return {
    bookmarks: props.items,
    setBookmarks: props.setItems,
    loadingBookmarks: props.loadingItems,
    mutateBookmarks: props.mutateItems,
  }
}
