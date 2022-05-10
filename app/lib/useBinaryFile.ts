//
// useBinaryFile.ts - loads an url as binary data
//

import { useEffect, useState } from "react"

/**
 * Loads url as binary data
 * @param url Url to be loaded
 * @returns Binary data contained in url
 */
export function useBinaryFile(url: string) {
  const [dataFile, setDataFile] = useState(null)

  useEffect(() => {
    // console.debug(`useBinaryFile - loading ${url}`)
    fetch(url).then((res) => {
      res.arrayBuffer().then((data) => setDataFile(data))
    })

    return () => {
      // console.debug(`useBinaryFile - unmounted ${url}`)
    }
  }, [url])

  return dataFile
}
