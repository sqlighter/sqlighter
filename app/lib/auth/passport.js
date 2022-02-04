import passport from "passport"
import LocalStrategy from "passport-local"
import { findUserByUsername, validatePassword } from "../db"
import { GoogleOneTapStrategy } from "passport-google-one-tap"

import { writeJson } from "../utilities"

passport.serializeUser(function (user, done) {
  console.log(`serializeUser`, user)
  // serialize the username into session
  done(null, user.email)
})

passport.deserializeUser(function (req, id, done) {
  // deserialize the username back into user object
  console.log(`deserializeUser`, id)
  // const user = findUserByUsername(req, id)
  done(null, { email: id })
})

// https://www.passportjs.org/packages/passport-google-one-tap/

// Configure the Google One Tap strategy for use by Passport.
//
// Google One Tap strategy require a `verify` function which receives the
// with the user's profile. The function must invoke `done`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(
  new GoogleOneTapStrategy(
    {
      consumerKey: process.env.GOOGLE_CLIENT_ID,
      consumerSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async function (profile, done) {
      console.log(`GoogleOneTapStrategy`, profile)
      await writeJson("profile.json", profile)
      if (!profile) {
        return done(undefined, undefined)
      }
      //      return done(undefined, { email: "gmettifogo@gmail.com" })
      profile.email = profile.emails[0].value
      return done(undefined, profile)
    }
  )
)
/*
passport.use(
  new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
    // Here you lookup the user in your DB and compare the password/hashed password
    const user = findUserByUsername(req, username)
    // Security-wise, if you hashed the password earlier, you must verify it
    // if (!user || await argon2.verify(user.password, password))
    if (!user || !validatePassword(user, password)) {
      done(null, null)
    } else {
      done(null, user)
    }
  })
)
*/
export default passport
