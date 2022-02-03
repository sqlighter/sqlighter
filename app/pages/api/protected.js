import nextConnect from "next-connect"
import auth from "../../middleware/auth"

const handler = nextConnect()

function requireAuthentication(req, res) {
  if (!req.user) {
    res.status(401).send("Unauthenticated")
    throw new Error(`Unauthenticated`)
  }
}

handler.use(auth).get((req, res, next) => {
  requireAuthentication(req, res)
  res.json({ user: req.user })
})

export default handler
