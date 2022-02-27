# Use prebuild base docker so we can speed up yarn installs
FROM eu.gcr.io/biomarkers-app/biomarkers-base
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
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production --immutable
# RUN yarn add --dev eslint eslint-config-next
RUN yarn add --dev typescript @types/react

# Copy everything except what is in .dockerignore (eg node_modules, etc)
COPY . ./

# Create production build
RUN yarn next build

# Run next.js server
CMD ["yarn", "next", "start"]

# Commands to build docker image, run it locally then deploy to Google Cloud Run
# docker build -t "eu.gcr.io/biomarkers-app/biomarkers-app:staging" --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID} .
# docker run -it --env-file=.env -p 127.0.0.1:80:3000 eu.gcr.io/biomarkers-app/biomarkers-app:staging
# docker push eu.gcr.io/biomarkers-app/biomarkers-app:staging
# gcloud run deploy biomarkers-app --quiet --region europe-west1 --image "eu.gcr.io/biomarkers-app/biomarkers-app:staging" --platform "managed" --allow-unauthenticated
