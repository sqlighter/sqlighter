//
// users.ts - user profiles and authentication information
//

import { Profile } from "passport"
import { Item } from "./items"
import { items } from "../database"
import { assert } from "console"

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

    /** User's biological gender, or closest hormonally, or undefined */
    gender?: "male" | "female"

    /** Height in cm */
    height?: number

    /** Weight in kg */
    weight?: number
  }

  /**
   * Retrieves user from database if found
   * @param userId Normally the user's email address
   */
  static async getUser(userId: string): Promise<User | null> {
    const item = await items.selectItem(userId)
    if (item) {
      return User.fromObject(item, User)
    }
    // console.debug(`User.getUser('${userId}') was not found`)
    return null
  }

  /**
   * Called when signing in using passport or other OAuth2 login provider.
   * This method will
   * @param id The user id, normally an email address (could be a normalized phone later)
   * @param profile The normalized profile for the user retrieved by signin provider
   * @returns A user, will create a new user if needed
   * @see https://www.passportjs.org/reference/normalized-profile/
   * @see https://datatracker.ietf.org/doc/html/draft-smarr-vcarddav-portable-contacts-00
   */
  static async signinUser(profile: Profile) {
    try {
      // for now we use user's email as id, later we may use phone number as well
      const email = profile?.emails?.[0]?.value
      console.debug(`User.signinUser - ${email}`, profile)
      if (!email || email.indexOf("@") == -1) {
        console.warn(`User.signinUser - profile is missing valid email`, profile)
        throw new Error("User profile doesn't have an email address")
      }

      let user = await User.getUser(email)
      if (!user) {
        // create a new user record with fresh profile
        user = new User()
        user.id = email
        user.passport = profile
        await items.insertItem(user)
      } else {
        // update existing user record
        user.passport = profile
        await items.updateItem(user)
      }

      // return with updated timestamps
      user = await User.getUser(user.id)
      assert(user)
      return user
    } catch (exception) {
      console.warn(`signinUser - ${exception}`, profile, exception)
      throw exception
    }
  }
}

export default User
