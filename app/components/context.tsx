//
// context.tsx
//

import { createContext } from "react"

/** Default context is an empty template, actual values filled by Context.Provider */
export const Context = createContext({
  /** Currently signed in user */
  user: null,

  /** Sign out of Google and local session */
  signout: (redirectUrl?: string): void => {
    throw new Error("Implemented in Context.Provider")
  },

  /** True if Google Signin script has been loaded and initialized */
  isGoogleSigninLoaded: null,
})
