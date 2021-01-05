FROM node:15-alpine

## Install ionic
RUN npm install -g @ionic/cli

## Copy source code
COPY . /sonos-kids-controller
WORKDIR /sonos-kids-controller

## Install dependencies
RUN npm install 

## Build Sonos Kids Controller
RUN ionic build --prod

## Config directory should be stored in a volume
VOLUME /sonos-kids-controller/server/config

## Expose service on port 8200
EXPOSE 8200

## Do not run as root user
USER node

## Start 
CMD npm start
