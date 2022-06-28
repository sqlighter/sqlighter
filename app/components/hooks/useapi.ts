//
// useApi.ts - hook and related utility methods
//

import useSWR from "swr"
import { fetcher } from "../../lib/api"

/** Retrieve data and metadata from relative url pointing to our APIs */
export function useApi<T = any>(url?: string) {
  if (!url) {
    return {
      data: null,
      metadata: null,
      isLoading: false,
      isError: false,
    }
  }

  const { data, error } = useSWR(url, fetcher)
  return {
    data: data?.data as T,
    metadata: data?.metadata,
    isLoading: !error && !data,
    isError: error,
  }
}
