#!/bin/bash
REPOSITORY=/home/ubuntu/server-build
cd $REPOSITORY

sudo rm -rf node_modules
sudo pnpm install --frozen-lockfile

sudo pm2 reload server