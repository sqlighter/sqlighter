import react from "react"

import { User } from "../lib/users"

/** Default context is an empty template, actual values filled by Context.Provider */
export const Context = react.createContext({
  /** Currently signed in user */
  user: null,

  /** Sign out of Google and local session */
  signout: (redirectUrl?: string): void => {
    throw new Error("Implemented in Context.Provider")
  },

  /**
   * Points to google.account.id only after the Google Signin script has been initialized
   * @see https://developers.google.com/identity/gsi/web/reference/js-reference#google.accounts.id.initialize
   */
  googleAccountsId: null,
})
