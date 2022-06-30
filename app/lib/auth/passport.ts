//
// passport.ts - configures Passport for Google One Tap signin
//

import passport, { Profile } from "passport"
import { GoogleOneTapStrategy } from "passport-google-one-tap"
import { User } from "../items/users"
import { items } from "../database"

/**
 * Retrieves user from database if found
 * @param userId Normally the user's email address
 */
export async function getUser(userId: string): Promise<User | null> {
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
export async function signinUser(profile: Profile) {
  try {
    // for now we use user's email as id, later we may use phone number as well
    const email = profile?.emails?.[0]?.value
    console.debug(`User.signinUser - ${email}`, profile)
    if (!email || email.indexOf("@") == -1) {
      console.warn(`User.signinUser - profile is missing valid email`, profile)
      throw new Error("User profile doesn't have an email address")
    }

    let user = await getUser(email)
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
    user = await getUser(user.id)
    console.assert(user)
    return user
  } catch (exception) {
    console.warn(`signinUser - ${exception}`, profile, exception)
    throw exception
  }
}

/** Serialize a user object into its email which is used as id in sessions */
passport.serializeUser(function (user: User, done) {
  // console.debug(`serializeUser - ${user.id}`)
  done(null, user.id)
})

/** Deserialize user's email (used as id) back into user's record */
passport.deserializeUser(async (req, id, done) => {
  const user = await getUser(id)
  if (!user) {
    console.warn(`deserializeUser - could not find user for email: ${id}`)
  }
  // console.debug(`deserializeUser - ${id}`)
  done(null, user)
})

/**
 * Configure the Google One Tap strategy for use by Passport.
 * Google One Tap strategy require a `verify` function which receives the
 * with the user's profile. The function must invoke `done` with a user
 * object, which will be set at `req.user` in route handlers after authentication.
 * @see https://www.passportjs.org/packages/passport-google-one-tap/
 */
passport.use(
  // https://console.cloud.google.com/apis/credentials/consent
  new GoogleOneTapStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // we receive our credentials from the client, no need to validate the csrf token or not
      verifyCsrfToken: false,
    },
    async function (profile, done) {
      try {
        const user = await signinUser(profile)
        return done(undefined, user)
      } catch (exception) {
        console.warn(`GoogleOneTapStrategy - an error occoured while signing in ${exception}`, exception)
        return done(exception, undefined)
      }
    }
  )
)

export default passport
