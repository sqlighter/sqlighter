//
// session.ts - handle session cookies
//

import Iron from "@hapi/iron"
import { parse, serialize } from "cookie"

// https://www.passportjs.org/reference/normalized-profile/

async function createLoginSession(session, secret) {
  const createdAt = Date.now()
  const obj = { ...session, createdAt }
  // console.debug(`createLoginSession`, session)

  const token = await Iron.seal(obj, secret, Iron.defaults)
  return token
}

async function getLoginSession(token, secret) {
  const session = await Iron.unseal(token, secret, Iron.defaults)
  const expiresAt = session.createdAt + session.maxAge * 1000
  const expired = session.maxAge && Date.now() > expiresAt
  // console.debug(`createLoginSession - expired: ${expired}`, session)

  // Validate the expiration date of the session
  if (expired) {
    throw new Error("Session expired")
  }
  return session
}

function parseCookies(req) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie
  return parse(cookie || "")
}

export default function session({ name, secret, cookie: cookieOpts }) {
  return async (req, res, next) => {
    const cookies = parseCookies(req)
    const token = cookies[name]
    let unsealed = {}

    if (token) {
      try {
        // the cookie needs to be unsealed using the password `secret`
        unsealed = await getLoginSession(token, secret)
      } catch (e) {
        // The cookie is invalid
      }
    }

    req.session = unsealed

    // We are proxying res.end to commit the session cookie
    const oldEnd = res.end
    res.end = async function resEndProxy(...args) {
      if (res.finished || res.writableEnded || res.headersSent) return
      if (cookieOpts.maxAge) {
        req.session.maxAge = cookieOpts.maxAge
      }

      const token = await createLoginSession(req.session, secret)
      res.setHeader("Set-Cookie", serialize(name, token, cookieOpts))
      oldEnd.apply(this, args)
    }

    next()
  }
}
