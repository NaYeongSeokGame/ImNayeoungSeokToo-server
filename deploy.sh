#!/bin/bash
REPOSITORY=/home/ubuntu/server-build
cd $REPOSITORY

sudo rm -rf node_modules
sudo yarn add --arch=x64 --platform=linux sharp
sudo yarn install

sudo pm2 reload server
