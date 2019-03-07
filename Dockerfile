FROM node:8

WORKDIR /usr/app

COPY package.json .
RUN npm install --quiet && mkdir coverage

COPY . .
 
EXPOSE 4001