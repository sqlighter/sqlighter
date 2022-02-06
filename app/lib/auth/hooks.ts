//
// hooks.ts - utility hooks for React
//

import useSWR from "swr"

export const fetcher = (url: string) => fetch(url).then((r) => r.json())

/** Retrieve information on currently logged in user */
export function useUser() {
  const { data, mutate } = useSWR("/api/user", fetcher)
  // if data is not defined, the query has not completed
  const loading = !data
  const user = data?.data
  return [user, { mutate, loading }]
}
