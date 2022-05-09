/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // https://nextjs.org/docs/advanced-features/i18n-routing
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
    /*   
    locales: ["en-US", "it-IT"],
    domains: [
      {
        domain: "insieme.app",
        defaultLocale: "it-IT",
      },
      {
        domain: "biomarkers.vercel.app",
        defaultLocale: "en-US",
      },
    ],
    */
  },
  images: {
    loader: "default",
    domains: [
      "localhost",
      "biomarkers.vercel.app",
      "insieme-api-zs2nymj7ga-ew.a.run.app",
      "storage.googleapis.com",
      "api.insieme.app",
      "insieme.app",
      "api.biomarkers.app",
      "biomarkers.app",
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  // see /docs/storage.md for more information
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // Change this to specific domain for better security
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
