//
// useItems.ts - a hook to easily access and modify items stored on the backend with our APIs
//

import useSWR from "swr"
import { fetcher, putJson, deleteJson } from "../../lib/api"
import { Item } from "../../lib/items/items"

interface UseItemsResults<T> {
  /** List of items retrieve from API. Will return [] if no items, undefined if still loading */
  items?: T[]
  /** True if list of items is being loaded */
  loadingItems: boolean
  /** When setting the list of items, this hook will delete removed items and update or insert new items */
  setItems: (items: T[]) => void
  /** Call to force a refresh from server */
  mutateItems: (items?: T[]) => void
}

/**
 * A hook to retrieve or modify items that are on standardized routes
 * in our APIs like `/api/queryes`. The hook will GET the list of items
 * that belong to the user that is currently signed in. If setItems is
 * called with a list having fewer items, the removed ones will be
 * deleted on the server via DELETE calls. If new items are added or
 * existing items updated the changes will be applied server side as well.
 */
export function useItems<T extends Item = Item>(apiUrl: string): UseItemsResults<T> {
  const { data, mutate } = useSWR(apiUrl, fetcher)

  /**
   * Callback used to post updated user information. Only the profile
   * attributes of the user item can be updated via this API. Other
   * parts of the user, like OpenId passport information cannot be updated.
   */
  async function setItems(items: T[]) {
    // console.debug(`useItems.setItems`, items)
    const existingItems = data?.data as T[]

    // see if an item we had is no longer in the list
    if (existingItems) {
      for (const existingItem of existingItems) {
        if (!items || items.findIndex((item) => item.id == existingItem.id) == -1) {
          // console.debug(`useItems.setItems - deleting ${existingItem.id}`)
          await deleteJson(`${apiUrl}/${existingItem.id}`)
        }
      }
    }

    // see if we need to update some items
    if (items) {
      for (const item of items) {
        const existingItem = existingItems && existingItems.find((i) => i.id == item.id)
        if (!existingItem || !shallowEqual(item, existingItem)) {
          // console.debug(`useItems.setItems - updating ${item.id}`)
          const updatedResponse = await putJson(`${apiUrl}/${item.id}`, item)
          const updatedItem = updatedResponse.data
          Object.assign(item, updatedItem)
        }
      }
    }

    // refresh data globally for this url
    // https://swr.vercel.app/docs/mutation
    mutate()
  }

  return {
    // if data is not defined, the query has not completed
    loadingItems: !data,
    // items is undefined if not loaded or always an array (empty if no items)
    items: data ? (data.data as T[]) || [] : undefined,
    // callback to update or delete items via APIs
    setItems,
    // force items reload via mutate callback
    mutateItems: mutate,
  }
}

/** Shallow comparing of object properties and no more (no deep structures for example) */
function shallowEqual(object1: Object, object2: Object): boolean {
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)
  if (keys1.length !== keys2.length) {
    return false
  }
  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false
    }
  }
  return true
}
