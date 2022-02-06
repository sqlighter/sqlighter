//
//
//

import nextConnect from "next-connect"
import passport from "../lib/auth/passport"
import session from "../lib/auth/session"

const auth = nextConnect()
  .use(
    session({
      name: "sess",
      secret: "sfgdfgsdfgsdfgsdfgsdf gsdfgsdf gsd fg sdfg sdf gsd fg sdfg sdfg sdf gsdf gsdfg ", //process.env.TOKEN_SECRET,
      cookie: {
        maxAge: 60 * 60 * 8, // 8 hours,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      },
    })
  )
  .use(passport.initialize())
  .use(passport.session())

export default auth
