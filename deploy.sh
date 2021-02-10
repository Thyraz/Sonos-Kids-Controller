#!/bin/bash

#cleanup
rm -rf deploy

# build personal web app
ionic build --prod

# copy everything to deploy directory
mkdir deploy
cp -Rp www deploy/
mkdir deploy/server
mkdir deploy/server/config
cp -p server/config/config-example.json  deploy/server/config/
cp -p server.js deploy/
cp -p package.json deploy/
cp -p README.md deploy/

# archive
cd deploy
zip -r ../../sonos-kids-controller.zip .
cd ..

#cleanup
rm -rf deploy