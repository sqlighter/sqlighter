//
// [...items].ts - routes for retrieving, updating, deleting items and attached files
//

import nextConnect from "next-connect"
import pluralize from "pluralize"
import { NextApiRequest, NextApiResponse } from "next"

import auth from "../../lib/auth/middleware"
import { ItemsTable, unpackItems } from "../../lib/database"
import { Item } from "../../lib/items/items"
import { getBucket } from "../../lib/storage"

const handler = nextConnect<NextApiRequest, NextApiResponse>({ attachParams: true })

handler
  .use(auth)

  /** Returns a specific record owned by the authenticated user */
  .get("/api/:itemTypes/:recordId", async (req: any, res) => {
    const itemType = pluralize.singular(req.params.itemTypes)
    const itemId = req.params.recordId
    await getItem(req, res, itemType, itemId)
  })

  /** Returns a list of records of a given type owned by the user */
  .get("/api/:itemTypes", async (req: any, res) => {
    const itemType = pluralize.singular(req.params.itemTypes)
    await getItems(req, res, itemType)
  })

  /**
   * Files can be uploaded and added to an item's 'files' attribute.
   * The upload is a three step process. First the client will put to
   * this url with the filename and contentType as the request's body json.
   * The API will sign and upload url that allows the client to upload
   * the file directly to Google Storage. Once the upload has completed
   * the client will call /upload/complete below to update the item.
   */
  .put("/api/:itemTypes/:itemId/files/upload/sign", async (req: any, res) => {
    const itemType = pluralize.singular(req.params.itemTypes)
    const itemId = req.params.itemId

    // user must be authenticated and if the item already exists it must be owned by the user
    const item = await itemsTable.selectItem(itemId)
    console.debug(`${req.url} - user: ${req.user?.id}, item: ${itemId}`, item)
    if (!req.user || (item && item.id != req.user.id && item.parentId != req.user.id)) {
      res.status(403).send("Unauthorized")
      return
    }

    // TODO validate filename and contentType inputs
    const filename = req.body.filename
    const contentType = req.body.contentType
    const storagePath = `${itemType}s/${itemId}/${filename}`
    const action = req.body.action || "write"
    console.debug(`${req.url} - sign '${action}' for ${storagePath}`)

    // https://googleapis.dev/nodejs/storage/latest/File.html#getSignedUrl
    const bucket = getBucket()
    const file = bucket.file(storagePath)
    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: action,
      expires: Date.now() + 600 * 1000,
      contentType: contentType,
      virtualHostedStyle: true,
    })

    // return item (if found) and signed url for file upload
    res.json({ data: item, metadata: { signedUrl } })
  })

  /** Called once a signed url upload has completed to update the item in database with the new file information */
  .put("/api/:itemTypes/:itemId/files/upload/complete", async (req: any, res) => {
    const itemType = pluralize.singular(req.params.itemTypes)
    const itemId = req.params.itemId

    // user must be authenticated and if the item already exists it must be owned by the user
    let item = await itemsTable.selectItem(itemId)
    console.debug(`${req.url} - user: ${req.user?.id}, item: ${itemId}`, item)
    if (!req.user || (item && item.id != req.user.id && item.parentId != req.user.id)) {
      res.status(403).send("Unauthorized")
      return
    }

    const filename = req.body.filename
    const contentType = req.body.contentType
    const storagePath = `${itemType}s/${itemId}/${filename}`

    // move file, update metadata, get info
    const storageBucket = getBucket()
    let storageFile = storageBucket.file(storagePath)
    const storageMedata = {
      private: true,
      contentType,
      contentDisposition: `attachment; filename="${filename}"`,
      // TODO when we'll really allow overwriting existing files we'll need to lower this cache max-age
      cacheControl: "max-age=604800, private, must-revalidate",
      metadata: { user: req.user.id },
    }
    storageMedata.metadata[itemType] = itemId
    await storageFile.setMetadata(storageMedata)
    const [, /* apiRes */ objRes]: [any, any] = await storageBucket.file(storagePath).get()
    const itemFile = {
      id: filename,
      url: objRes.selfLink, // https://www.googleapis.com/storage/v1/b/sqlighter/...
      contentType: objRes.contentType, // application/pdf
      etag: objRes.etag, // CM//k+68tvYCEAE=
      size: objRes.size,
      updatedAt: objRes.updated,
      storage: {
        type: "google",
        bucket: objRes.bucket, // sqlighter
        name: objRes.name, // records/rcd_u2tirteich9zijoakjhq/Document.pdf
      },
    }

    // add file information to database record
    const hasItem = !!item
    if (!item) {
      // create new item owned by user
      item = new Item()
      item.type = itemType
      item.id = itemId
      item.parentId = req.user.id
    }
    if (!item.files) {
      item.files = []
    }
    const existing = item.files.findIndex((file) => file.id == filename)
    if (existing != -1) {
      // console.debug(`${req.url} - updated file in item`, itemFile)
      item.files[existing] = itemFile
    } else {
      // console.debug(`${req.url} - inserted file in item`, itemFile)
      item.files.push(itemFile)
    }

    // insert or update database record
    if (hasItem) {
      await itemsTable.updateItem(item)
    } else {
      await itemsTable.insertItem(item)
    }
    item = await itemsTable.selectItem(item.id)
    console.debug(`${req.url} - ${hasItem ? "updated" : "inserted"} ${itemId}`, item)

    res.json({ data: item })
  })

  /** Updates given item as long as the caller is the rightful owner */
  .put("/api/:itemTypes/:itemId", async (req: any, res) => {
    const itemType = pluralize.singular(req.params.itemTypes)
    const itemId = req.params.itemId
    const item = req.body
    await updateItem(req, res, itemType, itemId, item)
  })

  /** Deletes an item as long as the caller is the owner */
  .delete("/api/:itemTypes/:itemId", async (req: any, res) => {
    const itemType = pluralize.singular(req.params.itemTypes)
    const itemId = req.params.itemId
    await deleteItem(req, res, itemType, itemId)
  })

// export router
export default handler

//
// utility methods
//

// access to database 'items' table
const itemsTable = new ItemsTable()

/** Returns a single item to the user as long as its found and ownership is confirmed */
async function getItem(req: NextApiRequest, res: NextApiResponse, itemType: string, itemId: string) {
  // item exists?
  const item = await itemsTable.selectItem(itemId)
  if (!item || item.type != itemType) {
    res.status(404).send(`Item ${itemId} was not found`)
    return
  }

  // user owns this item?
  const user = req.user
  if (!user || (item.id != user.id && item.parentId != user.id)) {
    res.status(403).send("Unauthorized")
    return
  }

  res.json({ data: item })
}

/** Returns all items of given type owned by authorized user */
async function getItems(req: NextApiRequest, res: NextApiResponse, itemType: string) {
  const user = req.user
  if (!user) {
    res.status(403).send("Unauthorized")
    return
  }

  let items = await itemsTable
    .select()
    .where("type", itemType)
    .where(function () {
      // item id matches user id (eg user type) or owned by user id (any other type)
      this.where("id", user.id).orWhere("parentId", user.id)
    })
    .orderBy("createdAt", "desc")

  res.json({ data: unpackItems(items) })
}

/** Updates a single item as long as its found and ownership is confirmed or creates as new and assigns owner */
async function updateItem(req: NextApiRequest, res: NextApiResponse, itemType: string, itemId: string, item) {
  // console.debug(`${req.url} - updating ${item.id}`, item)

  const user = req.user
  if (!user) {
    res.status(403).send("Unauthenticated")
    return
  }

  // item exists?
  const existingItem = await itemsTable.selectItem(itemId)
  if (existingItem) {
    // update item as long as user owns it
    if (existingItem.type != itemType) {
      res.status(404).send(`Item ${itemId} was not found`)
      return
    }
    const user = req.user
    if (!user || (existingItem.id != user.id && existingItem.parentId != user.id)) {
      res.status(403).send("Unauthorized")
      return
    }
    await itemsTable.updateItem(item)
  }
  // item is new?
  else {
    // set user as owner, insert new item
    item.parentId = user.id
    item.type = itemType
    await itemsTable.insertItem(item)
  }

  // return updated item as result
  const updatedItem = await itemsTable.selectItem(itemId)
  res.json({ data: updatedItem })
}

/** Deletes a single item as long as its found and ownership is confirmed */
async function deleteItem(req: NextApiRequest, res: NextApiResponse, itemType: string, itemId: string) {
  // console.debug(`${req.url} - deleting ${itemId}`)

  // item exists?
  const item = await itemsTable.selectItem(itemId)
  if (!item || item.type != itemType) {
    res.status(404).send(`Item ${itemId} was not found`)
    return
  }

  // user owns this item?
  const user = req.user
  if (!user || (item.id != user.id && item.parentId != user.id)) {
    res.status(403).send("Unauthorized")
    return
  }

  await itemsTable.deleteItem(itemId)
  res.status(204) // no content
  res.end()
}
