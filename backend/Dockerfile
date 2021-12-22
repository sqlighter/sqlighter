# Latest version of node
# FROM node
# https://github.com/strapi/strapi-docker/blob/master/examples/custom/Dockerfile
FROM strapi/strapi

ENV NODE_ENV production
ENV INSIEME_VAR1 provar1


WORKDIR /app

# Add environment variables to production image
# https://docs.docker.com/docker-hub/builds/advanced/
ARG COMMIT_MSG=""
ARG SOURCE_COMMIT=""
ARG SOURCE_BRANCH=""
ENV COMMIT_MSG=${COMMIT_MSG}
ENV SOURCE_COMMIT=${SOURCE_COMMIT}
ENV SOURCE_BRANCH=${SOURCE_BRANCH}

# Install dependencies
#RUN apt-get update
#RUN apt-get install -y unzip openjdk-8-jre-headless xvfb libxi6 libgconf-2-4
#RUN apt-get install -y ghostscript graphicsmagick ffmpeg
# librsvg

# Install Chrome
#RUN curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add
#RUN echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
#RUN apt-get -y update
#RUN apt-get -y install google-chrome-stable

# Install production packages + compiled apps
#COPY package*.json ./
COPY . .
#COPY yarn.lock ./
#RUN yarn install --production
RUN yarn build
#COPY dist dist

# Run node server
#CMD ["node", "dist/apps/api/main.js"]
CMD ["yarn", "start"]



# docker build -t "eu.gcr.io/emmo-app/emmo-api:staging" .
# docker run -it -p 127.0.0.1:80:1337 eu.gcr.io/emmo-app/emmo-api:staging
# docker push eu.gcr.io/emmo-app/emmo-api:staging
# gcloud run deploy emmo-api --quiet --region europe-west1 --image "eu.gcr.io/emmo-app/emmo-api:staging" --platform "managed" --allow-unauthenticated



# nx run-many --target=build --projects=api,insieme --only=prod
# docker build -t "eu.gcr.io/insieme-apps/insieme:staging" .
# docker push eu.gcr.io/insieme-apps/insieme:staging
# docker run -it -p 127.0.0.1:80:3333 eu.gcr.io/insieme-apps/insieme:staging
# gcloud run deploy insieme-staging --quiet --region europe-west1 --image "eu.gcr.io/insieme-apps/insieme:staging" --platform "managed" --allow-unauthenticated
