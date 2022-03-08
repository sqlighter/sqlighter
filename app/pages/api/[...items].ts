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

import { Record } from "../../lib/items/records"

// Google Cloud client library
const { Storage } = require("@google-cloud/storage")
const storage = new Storage()
const storageBucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET || "biomarkers-app")

const itemsTable = new ItemsTable()

async function getItem(req, res, itemType, itemId, verifyOwner = true) {
  const item = await itemsTable.selectItem(itemId)
  if (!item) {
    res.status(404).send(`Item ${itemId} was not found`)
  }
  // TODO check owner
  res.json({ data: item })
}

/** Returns all items of given type owned by authorized user */
async function getItems(req, res, itemType) {
  const user = req.user
  if (!user) {
    res.status(403).send("Unauthorized")
  }

  const items = await itemsTable
    .select()
    .where("parentId", user.id)
    .where("type", itemType)
    .orderBy("createdAt", "desc")

  res.json({ data: items })
}

const handler = nextConnect<NextApiRequest, NextApiResponse>({ attachParams: true })

handler
  .use(auth)

  /** Returns a specific health record */
  .get("/api/records/:recordId", async (req: any, res) => {
    console.debug(req.url, req.params)
    const recordId = req.params.recordId
    await getItem(req, res, "record", recordId)
  })

  /** Returns a user's health records */
  .get("/api/records/", async (req: any, res) => {
    await getItems(req, res, "record")
  })

  /** Post a document to a user's health records store */
  .post("/api/records", (req: any, res, next) => {
    console.debug("/api/records")

    const user = req.user

    const form = new multiparty.Form()
    form.parse(req, async (err, fields, files) => {
      console.debug(`${req.url} - fields, files`, fields, files)
      if (err) console.error(`multiparty - error`, err)

      if (files) {
        const file: any = Object.values(files)[0][0]

        console.debug(`${req.url} - uploading ${file}`, file)
        const record = new Record()
        const storagePath = `records/${record.id}/${file.originalFilename}`

        // https://googleapis.dev/nodejs/storage/latest/Bucket.html#upload
        const [apiRes, objRes] = await storageBucket.upload(file.path, {
          destination: storagePath,
          gzip: true, // compressed in storage
          metadata: {
            private: true,
            contentDisposition: `attachment; filename="${file.originalFilename}"`,
            cacheControl: "max-age=604800, private, must-revalidate",
            metadata: {
              user: req.user.id,
              record: record.id,
            },
          },
        })

        record.parentId = user.id
        record.title = file.originalFilename
        record.status = "draft"
        record.files = [
          {
            id: objRes.id, // biomarkers-app/records/rcd_u2tir...
            url: objRes.selfLink, // https://www.googleapis.com/storage/v1/b/biomarkers-app/...
            contentType: objRes.contentType, // application/pdf
            etag: objRes.etag, // CM//k+68tvYCEAE=
            size: objRes.size,
            //
            storage: {
              type: "google",
              bucket: objRes.bucket, // biomarkers-app
              name: objRes.name, // records/rcd_u2tirteich9zijoakjhq/Document.pdf
            },
          },
        ]

        console.log(`${storagePath} uploaded ${storagePath}`, objRes)

        // store and return to caller
        await itemsTable.insertItem(record)
        const savedRecord = await itemsTable.selectItem(record.id)
        console.debug(`${req.url} - saved record`, savedRecord)

        res.json({ data: savedRecord })
      }
    })
  })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
