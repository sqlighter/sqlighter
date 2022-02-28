import useSWR from "swr"

// fetcher is polyfilled by next.js and works on client and server alike
export const fetcher = async (input: RequestInfo, init: RequestInit, ...args: any[]) => {
  const res = await fetch(input, init)
  return res.json()
}

/** Retrieve data and metadata from relative url pointing to our APIs */
export function useApi(url: string) {
  console.assert(url != null && url.startsWith("/api/"))
  const { data, error } = useSWR(url, fetcher)
  return {
    data: data?.data,
    metadata: data?.metadata,
    isLoading: !error && !data,
    isError: error,
  }
}
