//
//
//

import nextConnect from "next-connect"
import { deepmerge } from "@mui/utils"
import auth from "../../middleware/auth"
import { ItemsTable } from "../../lib/database"
import { STATUS_CODES } from "http"

// https://www.passportjs.org/reference/normalized-profile/

const handler = nextConnect()

handler
  .use(auth)
  .get((req, res) => {
    // You do not generally want to return the whole user object
    // because it may contain sensitive field such as !!password!! Only return what needed
    // const { name, username, favoriteColor } = req.user
    // res.json({ user: { name, username, favoriteColor } })
    res.json({ data: req.user })
  })
  .post((req, res) => {
    const user = req.body
    //createUser(req, { username, password, name })

    res.status(204).json({ data: user })
  })
  .use((req, res, next) => {
    // handlers after this (PUT, DELETE) all require an authenticated user
    // This middleware to check if user is authenticated before continuing
    if (!req.user) {
      res.status(401).send("unauthenticated")
    } else {
      next()
    }
  })
  .put(async (req, res) => {
    const user = req.user
    const putUser = req.body
    if (!user || user.id != putUser.id) {
      res.status(403) // Forbidden
    }

    // retrieve user, merge and update
    const items = new ItemsTable()
    const databaseUser = await items.selectItem(user.id)
    databaseUser.attributes.profile = putUser.attributes.profile
    await items.updateItem(databaseUser)
    const updatedUser = await items.selectItem(putUser.id)
    console.log("PUT /api/user", putUser, updatedUser)

    res.json({ data: updatedUser })
  })
  .delete((req, res) => {
    //  deleteUser(req)
    req.logOut()
    res.status(204).end()
  })

export default handler
