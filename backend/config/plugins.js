var slugify = require("slugify");

module.exports = {
  upload: {
    config: {
      // Uploading media to Google Cloud Storage bucket (public read, private write/delete)
      // https://www.npmjs.com/package/strapi-provider-upload-google-cloud-storage
      provider: "strapi-provider-upload-google-cloud-storage",
      providerOptions: {
        bucketName: "insieme2",
        publicFiles: false,
        uniform: true, // all files in the bucket have same access rights
        basePath: "media",
        generateUploadFileName: (file) => {
          return `media/${slugify(file.hash)}${file.ext}`.toLowerCase();
        },
      },
    },
  },

  // ...more plugins
};
