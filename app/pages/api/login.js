import nextConnect from 'next-connect'
import auth from '../../middleware/auth'
import passport from '../../lib/passport'

const handler = nextConnect()
/*
handler.use(auth).post(passport.authenticate('local'), (req, res) => {
  res.json({ user: req.user })
})
*/

handler.use(auth).post(passport.authenticate("google-one-tap"), (req, res) => {
  res.json({ user: req.user })
})



export default handler
