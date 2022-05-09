


// uploading directly using a multipart/form
// this code was not used in the end because vercel has a very short
// timeout on API calls and slow uploads would cancel the call
// switched to uploading directly to google storage instead which is also quicker

import multiparty from "multiparty"
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
        const bucket = getBucket()
        const [apiRes, objRes] = await bucket.upload(file.path, {
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
            id: objRes.id, // sqlighter/records/rcd_u2tir...
            url: objRes.selfLink, // https://www.googleapis.com/storage/v1/b/sqlighter/...
            contentType: objRes.contentType, // application/pdf
            etag: objRes.etag, // CM//k+68tvYCEAE=
            size: objRes.size,
            //
            storage: {
              type: "google",
              bucket: objRes.bucket, // sqlighter
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