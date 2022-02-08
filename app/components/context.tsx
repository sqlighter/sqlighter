import react from "react"

import { User } from "../lib/users"

/** Default context is an empty template, actual values filled by Context.Provider */
export const Context = react.createContext({
  /** Currently signed in user */
  user: null,

  /** Sign out of Google and local session */
  signout: (redirectUrl?: string): void => {
    throw new Error("signOut - not implemented")
  },
})
