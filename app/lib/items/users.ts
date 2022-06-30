//
// users.ts - user profiles and authentication information (browser/node)
//

import { Profile } from "passport"
import { Item } from "./items"

export const USER_TYPE = "user"
export const USER_PREFIX = "usr_"

/** An extendable type for users with a customizable profile and openid based passport credentials */
export class User extends Item {
  constructor() {
    super()
    this.type = USER_TYPE
  }

  /** The normalized profile for the user retrieved by signin provider */
  passport?: Profile

  /** Additional user profile. Any fields with same labels as passport override passport info */
  profile?: {
    /** Birtdate in YYYY-MM-DD format */
    birthdate?: string

    /** Additional types, open ended */
    [key: string]: string | number | Date
  }

  /** Display name to be shown as one string */
  public getDisplayName(): string {
    return this.passport?.displayName || ""
  }

  /** Returns user's email (if available) */
  public getEmail(): string {
    return this.passport?.emails?.[0]?.value
  }

  public getProfileImageUrl(): string {
    return this.passport?.photos?.[0]?.value
  }
}

export default User
