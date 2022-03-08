//
// [...records].ts - routes for posting documents, retrieving personal health records
//

import nextConnect from "next-connect"
import multiparty from "multiparty"
import { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import util from "util"

import auth from "../../lib/auth/middleware"
import { Organization } from "../../lib/items/organizations"
import { ItemsTable } from "../../lib/database"

const itemsTable = new ItemsTable()

async function getItem(req, res, itemType, itemId, verifyOwner = true) {
  const item = await itemsTable.selectItem(itemId)
  if (!item) {
    res.status(404).send(`Item ${itemId} was not found`)
  }
  // TODO check owner
  res.json({ data: item })
}

async function getItems(req, res, itemType) {}

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler
  .use(auth)

  /** Returns a specific health record */
  .get("/api/records/:recordId", async (req: any, res) => {
    const recordId = req.params.recordId
    await getItem(req, res, "record", recordId)
  })
  /** Returns a user's health records */
  .get("/api/records/", async (req: any, res) => {
    await getItems(req, res, "record")
  })

  .use(async (req, res, next) => {
    const form = new multiparty.Form()
  
    await form.parse(req, function (err, fields, files) {
      if (err) console.error(`multiparty - error`, err)
      if (files) {
        req.body = fields
        (req as any).files = files
      }
      next()
    })
  })

  /** Post a document to a user's health records store */
  .post("/api/records/", (req: any, res, next) => {
    console.log(req.files)

//      res.writeHead(200, { 'content-type': 'text/plain' });
  //    res.write('received upload:\n\n');
//      res.end(util.inspect({ fields: fields, files: files }));
//res.end();  

    console.log(req.files)
    // console.debug(`/api/organizations/${organizationId}`, org)
   res.json({ data: req.files })
  })

export default handler
