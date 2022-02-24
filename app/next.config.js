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
      "biomarkers.app"
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
