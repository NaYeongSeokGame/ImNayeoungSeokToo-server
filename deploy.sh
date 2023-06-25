#!/bin/bash
REPOSITORY=/home/ubuntu/server-build
cd $REPOSITORY

sudo rm -rf node_modules
sudo yarn install
sudo pm2 reload server