//
//
//

import nextConnect from "next-connect"
import { NextApiRequest, NextApiResponse } from "next"
import auth from "../../lib/auth/middleware"
import { ItemsTable } from "../../lib/database"

// https://www.passportjs.org/reference/normalized-profile/

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler
  .use(auth)
  // returns currently authenticated user profile or null if no auth
  .get((req, res) => {
    res.json({ data: req.user })
  })
  // handlers after this require an authenticated user
  .use((req, res, next) => {
    // middleware checks if user is authenticated before continuing
    if (!req.user) {
      res.status(401).send("Unauthenticated")
    } else {
      next()
    }
  })
  // PUT /api/users - updates to user profile
  .put(async (req, res) => {
    try {
      const user = req.user
      const putUser = req.body
      if (!user || user.id != putUser.id) {
        res.status(403).send("Forbidden")
      }

      // retrieve user, merge and update
      const items = new ItemsTable()
      const databaseUser = await items.selectItem(user.id)

      // API can only be used to update user profile field. other parts of the
      // user object, for example the passport field are only modified internally
      // by the authentication code or the backend
      databaseUser.profile = putUser.profile
      await items.updateItem(databaseUser)
      const updatedUser = await items.selectItem(putUser.id)
      console.debug("PUT /api/user - updatedUser", updatedUser)
      res.json({ data: updatedUser })
    } catch (exception) {
      console.error("PUT /api/user", exception)
      throw exception
    }
  })
  .delete((req, res) => {
    // TODO will archive user or delete cascading records
    // deleteUser(req)
    req.logOut()
    res.status(204)
    res.end()
  })

export default handler
