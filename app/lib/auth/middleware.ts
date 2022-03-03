//
// middleware.ts - setup passport for authenticated sessions
//

import nextConnect from "next-connect"
import passport from "./passport"
import session from "./session"
import User from "../users"

/** Global augmentation of NextApiRequest with currently logged in user */
declare module "next" {
  export interface NextApiRequest {
    /** User is added to request by middleware when session is authenticated */
    user?: User

    /** Function used to sign out of current session (removes cookies, etc) */
    logOut?(): void
  }
}

const auth = nextConnect()
  .use(
    session({
      name: "sess",
      secret: process.env.TOKEN_SECRET,
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
