//
// [...organizations].ts - routes for organizations data and image assets
//

import nextConnect from "next-connect"
import { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import auth from "../../../lib/auth/middleware"

import { Organization } from "../../../lib/items/organizations"

function getImageUrl(imagePath: string) {
  if (imagePath) {
    const idx = imagePath.indexOf("contents/organizations")
    if (idx != -1) {
      return "/api/" + imagePath.substring(idx)
    }
  }
  return undefined
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
  .get("/api/organizations/:organizationId", async (req: any, res) => {
    const organizationId = req.params.organizationId
    const org = { ...(await Organization.getOrganization(organizationId)), type: "organization" }
    for (const idx in org.images) {
      const image = org.images[idx]
      org.images[idx] = { ...image, url: getImageUrl(image.path) }
    }

    // console.debug(`/api/organizations/${organizationId}`, org)
    res.json({ data: org })
  })

  /** Returns an organization's logo */
  .get("/api/organizations/:organizationId/image", async (req: any, res: any) => {
    const org = await Organization.getOrganization(req.params.organizationId)
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
