import useSWR from "swr"

// fetcher is polyfilled by next.js and works on client and server alike
export const fetcher = async (input: RequestInfo, init: RequestInit, ...args: any[]) => {
  const res = await fetch(input, init)

  // if the status code is not in the range 200-299, we still try to parse and throw it
  if (!res.ok) {
    const error: any = new Error("An error occurred while fetching the data.")
    // attach extra info to the error object
    error.info = await res.json()
    error.status = res.status
    throw error
  }
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
export function useApi<T = any>(url: string) {
  if (!url) {
    return {
      data: null,
      metadata: null,
      isLoading: false,
      isError: false,
    }
  }

  console.assert(url != null)
  const { data, error } = useSWR(url, fetcher)
  return {
    data: data?.data as T,
    metadata: data?.metadata,
    isLoading: !error && !data,
    isError: error,
  }
}
