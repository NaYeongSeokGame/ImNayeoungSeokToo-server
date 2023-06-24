#!/bin/bash
REPOSITORY=/home/ubuntu/server-build
sudo pm2 kill
cd $REPOSITORY

sudo rm -rf node_modules
sudo yarn install
sudo pm2 kill
sudo pm2 start src/app.ts