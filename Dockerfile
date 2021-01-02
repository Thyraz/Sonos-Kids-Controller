FROM node:15-alpine

WORKDIR /sonos-kids-controller

# debug could not get uid/gid error.
#RUN npm config set unsafe-perm true
RUN npm install -g @ionic/cli

COPY . /sonos-kids-controller

RUN npm install 
RUN ionic build --prod

VOLUME /sonos-kids-controller/server/config
EXPOSE 8200

CMD npm start
