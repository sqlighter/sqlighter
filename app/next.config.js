/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    loader: "default",
    domains: [
      "localhost",
      "insieme-api-zs2nymj7ga-ew.a.run.app",
      "storage.googleapis.com",
      "api.insieme.app",
      "insieme.app",
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
