//
// signout.ts - signs out of user session on the server, invalidates tokens
//

import nextConnect from "next-connect"
import auth from "../../lib/auth/middleware"

const handler = nextConnect()

handler.use(auth).get((req: any, res: any) => {
  req.logOut()
  res.status(204)
  res.end()
})

export default handler
