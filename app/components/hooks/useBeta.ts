//
// usebeta.ts
//

import { useParams } from "react-router-dom"

/**
 * A simple hook returning true if beta mode features
 * should be enabled. For now this is based on ?beta=true
 * being indicated in the query string, later it could
 * be due to user being subscribed to beta list, etc.
 * @returns True if beta mode enabled
 */
export function useBeta() {
  const { beta } = useParams()
  console.debug(`useBeta - ${beta}`)
  return [!!beta]
}
