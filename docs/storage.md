## Storage

This application will use Google Storage for customer's data/preferences. All data resides in a private bucket and can only be accessed via the APIs or using server signed urls. The app uploads directly to Google Storage after obtaining a signed upload url from the proper /api endpoint. Uploading to the bucket requires a bit more work but is faster for clients and doesn't put any load on the API containers.

Example of upload flow:

1. Retrieve signed upload url from APIs  
   `PUT /api/records/rcd_xxx/files/upload/sign`

2. Upload document from the client directly to Google Storage bucket  
   `PUT https://sqlighter.storage.googleapis.com/records/rcd_xxxxx/....`

3. Complete upload, create/update record with stored file  
   `PUT /api/records/rcd_xxx/files/upload/complete`

### Cross Origin Access Policy (CORS)

When uploading directly from the browser to the storage bucket our request will be validated by the browser for its cross origin policy. The storage bucket needs to be configured before hand with the following commands so that it can return the proper CORS policy to the browser.

To the the CORS policy on the bucket, first edit `storage-cors-config.json` to include your origins, then run the following command replacing with your bucket name:  
`gsutil cors set storage-cors-config.json gs://sqlighter`

To see that the policy has been correctly applied:  
`gsutil cors get gs://sqlighter`

### References

Get or set a CORS JSON document for one or more buckets  
https://cloud.google.com/storage/docs/gsutil/commands/cors#synopsis

Chrome Referrer Policy:  
https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default

Details on HTTP Referrer-Policy headers:  
https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy

How to configure Next.js CORS headers:  
https://nextjs.org/docs/api-reference/next.config.js/headers
