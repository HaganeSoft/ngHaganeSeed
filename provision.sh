#!/bin/bash

apt-get update

## For compiling
# apt-get install -y build-essential

## Install apache
apt-get -y install apache2
if ! [ -L /var/www/html ]; then
  rm -rf /var/www/html
  ln -fs /vagrant /var/www/html
fi

## Install nodejs
apt-get -y install curl
curl --silent --location https://deb.nodesource.com/setup_5.x | sudo bash -
apt-get -y install nodejs

## Install gulp
npm config set registry http://registry.npmjs.org/
npm install -g gulp

