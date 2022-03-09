## Hosting for Next.js


### Google Cloud Run

Pros 
- Priced per fraction of a second, you only pay if you really use it
- Scales automatically within region or multiregion
- Deploy automatically via Google Cloud Build
- Based on Dockerfile, can pick and choose OS, addons, etc
- Serverless code is closer to file storage, hosted MySQL

Cons:
- Almost no documentation on how to run next.js on Google CloudRun
- Setup is more complicated, dockerfile, cloudbuild.yaml, etc


### Vercel

Pros:
- House of next.js
- Vercel hosting is cleaner with fewer features
- Simple analytics similar to https://pagespeed.web.dev
- Hosting performance is really good, CDN is included automatically

Cons:  
- Pricing hard to understand, based on teams but with low quotas
- Lower priced tier (hobby) is fixed in US region, has short timeouts
- No database hosting means MySQL is far from serverless containers


In the end I liked vercel's service better because of its simplicity and design. I choose CloudRun because it's actually better and cheaper. Pay by time used, closer to storage files and MySQL. I also used CloudRun to deploy directus.io which is a headless CMS that is quite useful to build quick APIs based on MySQL data. It would be very simple to put the project back on vercel if needed.

Still using vercel during development because of it's much quicker build time and container startup times.  