/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || 'https://sqlighter.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: "weekly",

  // other options... 
  // https://www.npmjs.com/package/next-sitemap
}

module.exports = config
