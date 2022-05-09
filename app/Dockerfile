# Use base docker with prebuild tools
FROM node:16-slim
WORKDIR /app

# Add environment variables to production image
# https://docs.docker.com/docker-hub/builds/advanced/
ARG COMMIT_MSG=""
ARG SOURCE_COMMIT=""
ARG SOURCE_BRANCH=""
ENV COMMIT_MSG=${COMMIT_MSG}
ENV SOURCE_COMMIT=${SOURCE_COMMIT}
ENV SOURCE_BRANCH=${SOURCE_BRANCH}
ENV NODE_ENV production

# Copy application dependency manifests to the container image
# Copying this separately prevents re-running yarn install on every code change
COPY .yarn ./
COPY .yarnrc.yml ./
COPY package.json ./
COPY yarn.lock ./

RUN npm i -g npm@latest
RUN npm update -g yarn@latest
RUN yarn set version latest
RUN yarn -v
RUN yarn install

# Copy everything except what is in .dockerignore (eg node_modules, etc)
COPY . ./

# Create production build
RUN yarn next build

# Run next.js server
CMD ["yarn", "next", "start"]

# Commands to build docker image, run it locally then deploy to Google Cloud Run
# docker build -t "gcr.io/sqlighter/sqlighter:staging" --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID} .
# docker run -it --env-file=.env -p 127.0.0.1:80:3000 eu.gcr.io/sqlighter/sqlighter:staging
# docker push gcr.io/sqlighter/sqlighter:staging
# gcloud run deploy sqlighter --quiet --region europe-west1 --image "gcr.io/sqlighter/sqlighter:staging" --platform "managed" --allow-unauthenticated
