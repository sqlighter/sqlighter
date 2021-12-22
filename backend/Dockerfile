# Latest version of node
# FROM node
# https://github.com/strapi/strapi-docker/blob/master/examples/custom/Dockerfile
FROM strapi/strapi

# Add environment variables to production image
# https://docs.docker.com/docker-hub/builds/advanced/
ARG COMMIT_MSG=""
ARG SOURCE_COMMIT=""
ARG SOURCE_BRANCH=""
ENV COMMIT_MSG=${COMMIT_MSG}
ENV SOURCE_COMMIT=${SOURCE_COMMIT}
ENV SOURCE_BRANCH=${SOURCE_BRANCH}
ENV NODE_ENV production

WORKDIR /app

# Copy only what we need (no node_modules)
COPY package.json .
COPY yarn.lock .
COPY favicon.ico .
COPY config config
COPY data data
COPY database database
COPY public public
COPY src src

# Install production packages + compiled apps
RUN yarn install --production
RUN yarn build

# Run node server
CMD ["yarn", "start"]

# Commands to build docker image, run it locally and deploy to Google Cloud Run
# docker build -t "eu.gcr.io/insieme2/insieme-api:staging" .
# docker run -it --env-file=.env -p 127.0.0.1:80:1337 eu.gcr.io/insieme2/insieme-api:staging
# docker push eu.gcr.io/insieme2/insieme-api:staging
# gcloud run deploy insieme-api --quiet --region europe-west1 --image "eu.gcr.io/insieme2/insieme-api:staging" --platform "managed" --allow-unauthenticated
