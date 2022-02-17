//
// [...organizations].ts - routes for organizations data and image assets
//

import nextConnect from "next-connect"
import { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import auth from "../../middleware/auth"

import { Organization } from "../../lib/organizations"

function getImageUrl(imagePath: string) {
  return "/api/" + imagePath.substring(imagePath.indexOf("contents/organizations"))
}

const mimeTypes = {
  svg: "image/svg+xml",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
}

const handler = nextConnect<NextApiRequest, NextApiResponse>({ attachParams: true })

handler
  .use(auth)

  /** Returns an organization's details */
  .get("/api/organizations/:organizationId", (req: any, res) => {
    const org = Organization.getOrganization(req.params.organizationId)
    for (const image of org.images) {
      image.url = getImageUrl(image.path) // relative from server root
      delete image.path
    }
    res.json({ data: org })
  })

  /** Returns an organization's logo */
  .get("/api/organizations/:organizationId/image", (req: any, res: any) => {
    const org = Organization.getOrganization(req.params.organizationId)
    const image = org.images[0]
    const imagePath = image.path
    const imageStat = fs.statSync(imagePath)

    res.writeHead(200, {
      "Content-Type": mimeTypes[image.type],
      "Content-Length": imageStat.size,
      "Cache-Control": `max-age=${8 * 60 * 60}`, // 8h
    })

    // will pipe asynchronously (no blocking)
    const readStream = fs.createReadStream(imagePath)
    readStream.pipe(res)
  })

export default handler
