#####
# Stage 1: Build ionic
#####
FROM node:15-alpine as build

## Install ionic
RUN npm install -g @ionic/cli

## Copy source code
COPY . /sonos-kids-controller
WORKDIR /sonos-kids-controller

## Install dependencies
RUN npm install 

## Build Sonos Kids Controller
RUN ionic build --prod

#####
# Stage 2: package
#####
FROM node:15-alpine 

## Copy source code
COPY . /sonos-kids-controller
WORKDIR /sonos-kids-controller

## Install dependencies
RUN npm install --production

COPY --from=build /sonos-kids-controller/www/ /sonos-kids-controller/www/

## Config directory should be stored in a volume
VOLUME /sonos-kids-controller/server/config

## Expose service on port 8200
EXPOSE 8200

## Do not run as root user
USER node

## Start 
CMD npm start
