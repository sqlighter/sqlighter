import useSWR from "swr"

// fetcher is polyfilled by next.js and works on client and server alike
export const fetcher = async (input: RequestInfo, init: RequestInit, ...args: any[]) => {
  const res = await fetch(input, init)
  return res.json()
}

/**
 * Perform a json PUT on given url
 * @param url The url of the API, eg. /api/user
 * @param data The object to put (will be converted to json)
 * @returns The response data
 */
export async function putJson(url, data) {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return response.json()
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

