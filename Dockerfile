# treey.io client

# Node base image
FROM node:6

# Maintainer
MAINTAINER Gilles Wittenberg <docker.io@gilleswittenberg.com>

# Environment variables
ENV NODE_ENV ""
ENV DIR /var/www

# Install app
WORKDIR $DIR
COPY . $DIR
RUN npm install .
RUN npm run build

# Expose ports used by app
EXPOSE 80

# Start app
CMD NODE_ENV=$NODE_ENV npm start
