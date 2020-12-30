FROM node:15-alpine
# debug could not get uid/gid error.
RUN npm config set unsafe-perm true
RUN npm install -g @ionic/cli
RUN wget https://github.com/Thyraz/Sonos-Kids-Controller/archive/master.zip
RUN unzip master.zip
RUN rm master.zip 
WORKDIR /Sonos-Kids-Controller-master
VOLUME /Sonos-Kids-Controller-master/server/config
RUN npm install 
RUN ionic build --prod
ADD ./server/config/config-example.json ./server/config/config.json
EXPOSE 8200
CMD npm start
