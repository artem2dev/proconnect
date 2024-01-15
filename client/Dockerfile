FROM node:18

WORKDIR /app

COPY package*.json /app/

RUN yarn

COPY . .

RUN yarn build
