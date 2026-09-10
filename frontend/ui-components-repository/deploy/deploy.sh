#!/bin/bash

DEPLOY_SERVER=$DEPLOY_SERVER
SERVER_FOLDER="ui-components-repository"

# Building React output
yarn install
yarn run build

echo "Deploying to ${DEPLOY_SERVER}"
scp -r dist/ root@${DEPLOY_SERVER}:/var/www/${SERVER_FOLDER}/

echo "Finished copying the build files"
