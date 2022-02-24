//
// pages/api/contents/[...path].ts - serve static assets from /contents directory
//

import express from "express"
import path from "path"

// Tell Next.js to pass in Node.js HTTP
// express is just a function that takes (http.IncomingMessage, http.ServerResponse),
// which Next.js supports when externalResolver is enabled.
export const config = {
  api: { externalResolver: true },
}

// http://expressjs.com/en/5x/api.html#example.of.express.static
const handler = express()
const contentsDirectory = path.resolve("contents")
const contentsOptions = {
  dotfiles: "ignore",
  extensions: ["jpg", "jpeg", "svg", "png"], // no .md or .json files
  index: false,
  maxAge: "8h",
}
const serveFiles = express.static(contentsDirectory, contentsOptions)
handler.use("/api/contents", serveFiles)

export default handler
