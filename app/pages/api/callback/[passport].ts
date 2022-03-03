//
// callback used to establish authenticated session with passport strategy
// for example this callback is called by client with user has finished
// logging in and we received their jwt credentials from google signin.
//

import nextConnect from "next-connect"
import auth from "../../../lib/auth/middleware"
import passport from "../../../lib/auth/passport"
import { NextApiRequest, NextApiResponse } from "next"

const handler = nextConnect()

handler.use(auth).post(passport.authenticate("google-one-tap"), (req: NextApiRequest, res: NextApiResponse) => {
  // https://www.passportjs.org/reference/normalized-profile/
  res.json({ data: (req as any).user })
})

export default handler
