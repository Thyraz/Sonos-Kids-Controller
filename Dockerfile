FROM node:15-alpine
# debug could not get uid/gid error.
RUN npm config set unsafe-perm true
RUN npm install -g @ionic/cli
WORKDIR /Sonos-Kids-Controller-master
VOLUME /Sonos-Kids-Controller-master/server/config
RUN npm install 
RUN ionic build --prod
ADD ./server/config/config-example.json
EXPOSE 8200
CMD npm start