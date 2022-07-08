//
// useBookmarks.ts - a hook to easily access bookmarked queries
//

import { useItems } from "./useitems"
import { Query } from "../../lib/items/query"
import { User } from "../../lib/items/users"

/** A hook to retrieve and modify queries that have been bookmarked on the server */
export function useBookmarks(user: User) {
  const props = useItems<Query>(user && "/api/queries")
  return {
    bookmarks: props?.items,
    setBookmarks: props?.setItems,
    loadingBookmarks: props?.loadingItems,
    mutateBookmarks: props?.mutateItems,
  }
}
