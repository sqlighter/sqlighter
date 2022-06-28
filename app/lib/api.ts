//
// api.ts - utilities to access APIs
//

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
 * Returns a json on given url
 * @param url The url of the API, eg. /api/user
 * @returns The response data
 */
export async function getJson(url): Promise<any> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  return response.json()
}

/**
 * Perform a json PUT on given url
 * @param url The url of the API, eg. /api/user
 * @param data The object to put (will be converted to json)
 * @returns The response data
 */
export async function putJson(url, data): Promise<any> {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

/**
 * Perform a json DELETE on given url
 * @param url The url of the API, eg. /api/user
 * @param data The optional object to sent (will be converted to json)
 * @returns The response data
 */
export async function deleteJson(url, data?): Promise<void> {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: data && JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`deleteJson - url: ${url}, ${response.status}: ${response.statusText}`)
  }
}
