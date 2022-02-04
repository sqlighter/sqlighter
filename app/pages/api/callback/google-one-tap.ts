import nextConnect from "next-connect"
import auth from "../../../middleware/auth"
import passport from "../../../lib/auth/passport"
import { ServerResponse } from "http"

const handler = nextConnect()

handler.use(auth).post(passport.authenticate("google-one-tap"), (req, res) => {
  // https://www.passportjs.org/reference/normalized-profile/
  res.json({ user: req.user })
})

export default handler
