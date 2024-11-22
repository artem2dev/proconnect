FROM node:18.20.5

WORKDIR /app

COPY package*.json /app/

RUN yarn

COPY . .

RUN yarn build
