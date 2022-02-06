//
// passport.js - configures Passport for Google One Tap signin
//

import passport from "passport"
import { GoogleOneTapStrategy } from "passport-google-one-tap"
import { User } from "../users"

/** Serialize a user object into its email which is used as id in sessions */
passport.serializeUser(function (user, done) {
  // console.debug(`serializeUser - ${user.id}`)
  done(null, user.id)
})

/** Deserialize user's email (used as id) back into user's record */
passport.deserializeUser(async (req, id, done) => {
  const user = await User.getUser(id)
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
  new GoogleOneTapStrategy(
    {
      consumerKey: process.env.GOOGLE_CLIENT_ID,
      consumerSecret: process.env.GOOGLE_CLIENT_SECRET,
      verifyCsrfToken: false, // we receive our credentials from the client, no need to validate the csrf token or not
    },
    async function (profile, done) {
      try {
        const user = await User.signinUser(profile)
        return done(undefined, user)
      } catch (exception) {
        console.warn(`GoogleOneTapStrategy - an error occoured while signing in ${exception}`, exception)
        return done(exception, undefined)
      }
    }
  )
)

export default passport
