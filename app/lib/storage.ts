//
// storage.ts - utilities to access to Google Storage buckets and files
//

import { assert } from "console"
import { Storage } from "@google-cloud/storage"
import { temporaryWriteSync } from "tempy"

/**
 * Returns Google Storage credentials and client
 * @param credentialsJson Google service account credentials as a json strig
 * @returns Google service account credentials and storage object
 */
export function getStorage(credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT) {
  assert(credentialsJson, "getStorage - GOOGLE_SERVICE_ACCOUNT is not configured")
  const credentials = JSON.parse(credentialsJson)
  const keyFilename = temporaryWriteSync(credentialsJson, { extension: "json" })
  const storage = new Storage({ projectId: credentials.project_id, keyFilename })
  return { credentials, storage, keyFilename }
}

/** Returns Google storage bucket using .env credentials */
export function getBucket(bucketName?: string) {
  const { credentials, storage } = getStorage()
  return storage.bucket(bucketName ? bucketName : credentials.project_id)
}
