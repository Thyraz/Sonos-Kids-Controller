#!/bin/bash

#cleanup
rm -rf deploy

# build personal web app
ionic build --prod

# Pause execution to see if the build process worked
read -p "Press Enter to resume ..."

# copy everything to deploy directory
mkdir deploy
cp -Rp www deploy/
mkdir deploy/server
mkdir deploy/server/config
cp -p server/config/config-example.json  deploy/server/config/
cp -p server.js deploy/
cp -p package-deploy.json deploy/package.json
cp -p README.md deploy/

# archive
cd deploy
zip -r ../../sonos-kids-controller.zip .
cd ..

#cleanup
rm -rf deploy