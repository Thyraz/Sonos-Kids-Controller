FROM node:15-alpine

RUN npm install -g @ionic/cli

COPY . /sonos-kids-controller
WORKDIR /sonos-kids-controller

RUN npm install 
RUN ionic build --prod

VOLUME /sonos-kids-controller/server/config
EXPOSE 8200

CMD npm start
