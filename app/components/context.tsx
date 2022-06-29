//
// context.tsx
//

import { createContext } from "react"
import { User } from "../lib/items/users"

interface AppContextInterface {
  /** Currently signed in user */
  user?: User

  /** Sign out of Google and local session */
  signout: (redirectUrl?: string) => void

  /**
   * Google Signin Client available once script is loaded and initialized
   * @see https://developers.google.com/identity/gsi/web/reference/js-reference
   */
  googleSigninClient?: any
}

/** Default context is an empty template, actual values filled by Context.Provider */
export const Context = createContext<AppContextInterface>({
  /** Sign out of Google and local session */
  signout: (redirectUrl?: string): void => {
    throw new Error("Implemented in Context.Provider")
  },
})
