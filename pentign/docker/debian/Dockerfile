FROM debian:buster-20181112

LABEL version="1.0"

### Arguments pour le build de l'image
# DNS
ARG dnsHost=""
ARG dnsIP=""
# Proxy
ARG proxy=""

### DNS

RUN if [ "$dnsHost" != "" ] ; then echo "search $dnsHost" > /etc/resolv.conf ; fi
RUN if [ "$dnsHost" != "" ] ; then echo "nameserver $dnsIP" >> /etc/resolv.conf ; fi

### PROXY
ENV http_proxy=$proxy
ENV https_proxy=$proxy
ENV HTTP_PROXY=$proxy
ENV HTTPS_PROXY=$proxy

### MAJ
RUN apt-get -y update
RUN apt-get -y upgrade

### Utilitaires
RUN apt-get -y install wget vim unzip

### Installation des dépendances de NodeJS
RUN apt-get install -y python g++ make

### Installation de NodeJS à partir des sources
# https://github.com/nodejs/node/blob/master/BUILDING.md#building-nodejs-on-supported-platforms
# https://github.com/nodejs/help/wiki/Installation
WORKDIR /home/docker/nodejs
RUN wget -O node-v10.13.0.tar.gz "https://nodejs.org/dist/v10.13.0/node-v10.13.0.tar.gz"
RUN tar -xzf /home/docker/nodejs/node-v10.13.0.tar.gz
RUN cd node-v10.13.0  && ./configure && make -j4 && make install

### Dossier de l'application
WORKDIR /home/docker/app

### Récupération des sources de l'application
COPY package.json ./
COPY eslint.json ./
COPY jsdoc.json ./
COPY src ./src/
COPY /test ./test/

### Installation des dépandences de l'application NodeJS
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md
# https://expressjs.com/fr/starter/installing.html
RUN npm install

### Installation de mocha pour les tests
# https://mochajs.org/#installation
RUN npm install mocha -g

### Installation de eslint pour le code
# https://eslint.org/docs/user-guide/configuring
RUN npm install eslint -g

### Installation de jsdoc pour la documentation du code
# http://usejsdoc.org/about-configuring-jsdoc.html
RUN npm install jsdoc -g

### Commande de lancement de l'application
CMD npm start
