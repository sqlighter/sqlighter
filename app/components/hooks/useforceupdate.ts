//
// useforceupdate.ts
//

import { useState } from "react"

/** Will force a component to refresh itself when forceUpdate() is called */
export function useForceUpdate() {
  const [, setValue] = useState(0)
  return () => setValue((value) => value + 1)
}
