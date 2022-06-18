//
// upload.tsx - a button used to upload files to google storage
//

import React, { useCallback } from "react"
import useFileUploader, { FileBag } from "react-uploader-hook"
import { useSWRConfig } from "swr"
import LoadingButton from "@mui/lab/LoadingButton"

import { Item } from "../lib/items/items"

interface UploadButtonProps {
  /** Item type we're uploading files to, eg. /api/records/rcd_xxxxxx > record */
  itemType: string

  /** Item we're uploading files to, eg. /api/records/rcd_xxxxxx > rcd_xxxxxx */
  itemId: string

  /** Called while one or more files are being uploaded */
  onProgress?: (progress: number, allUploading: FileBag[]) => void

  /** Called when a file has been uploaded to storage */
  onUploaded?: (item: Item, fileBag: FileBag, allUploaded: FileBag[]) => void

  /** Called if an upload has failed */
  onFailed?: (fileBag: FileBag, allFailed: FileBag[]) => void
}

export function UploadButton(props: UploadButtonProps) {
  // when a file is uploaded we invalidate the item so it's refreshed
  const { mutate } = useSWRConfig()

  // eg. /api/records/rcd_xxxxxx
  const itemType = props.itemType
  const itemId = props.itemId

  /**
   * This method is called when a file has been picked and is ready to be uploaded.
   * It will obtain a signed url from the APIs which can be used to upload directly
   * to storage then return the fetch argoments to complete the upload.
   */
  const getUploadParams = useCallback(async (file) => {
    try {
      const signUrl = `/api/${itemType}s/${itemId}/files/upload/sign`
      const response = await fetch(signUrl, {
        method: "put",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, size: file.size, contentType: file.type }),
      })
      const { metadata } = await response.json()
      console.debug(`UploadButton.getUploadParams - uploading ${file.name} to ${metadata.signedUrl}`, file)

      // file is uploaded with a PUT of its body directly to google storage using a signed url
      return {
        method: "put",
        url: metadata.signedUrl,
        headers: { "Content-Type": file.type },
        data: file,
      }
    } catch (exception) {
      console.error(`UploadButton.getUploadParams - exception: ${exception}`, exception)
    }
  }, [])

  /** Called when an upload complets will notify server, update item, dispatch event */
  const onUploaded = useCallback(async (fileBag: FileBag, allUploaded: FileBag[]) => {
    // notify server that file upload on google storage has completed
    const completeUrl = `/api/${props.itemType}s/${props.itemId}/files/upload/complete`
    const response = await fetch(completeUrl, {
      method: "put",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ filename: fileBag.file.name, size: fileBag.file.size, contentType: fileBag.file.type }),
    })
    const { data } = await response.json()
    console.debug(`UploadButton.onUploaded - ${completeUrl}`, data)

    // refresh item individually and as a collection
    mutate(`/api/${itemType}s/${itemId}`, data, false)
    mutate(`/api/${itemType}s`)

    if (props.onUploaded) {
      props.onUploaded(data, fileBag, allUploaded)
    }
  }, [])

  /** Callback used when one or more uploads fail */
  const onFailed = useCallback(async (fileBag: FileBag, allFailed: FileBag[]) => {
    console.debug(`UploadButton.onFailed`, fileBag, allFailed)
    if (props.onFailed) {
      props.onFailed(fileBag, allFailed)
    }
  }, [])

  // setup uploader hook with callbacks
  const { onDrop, fileBags } = useFileUploader({ getUploadParams, onUploaded, onFailed })

  // determine overall upload progress
  let progress = 100
  if (fileBags) {
    for (const fileBag of fileBags) {
      if (fileBag.status == "uploading") {
        progress = Math.min(progress, fileBag.progress)
      }
    }
    if (props.onProgress) {
      props.onProgress(progress, fileBags)
    }
  }

  const handleChange = useCallback(
    (event) => {
      onDrop(event.target.files)
    },
    [onDrop]
  )

  // to show fileBags data structure add:
  // <pre>{JSON.stringify(fileBags, null, 2)}</pre>

  return (
    <>
      <label htmlFor="contained-button-file">
        <input
          accept="application/pdf"
          id="contained-button-file"
          type="file"
          style={{ display: "none" }}
          onChange={handleChange}
          multiple={true}
        />
        <LoadingButton variant="outlined" component="span" loading={progress < 100}>
          Upload
        </LoadingButton>
      </label>
    </>
  )
}
