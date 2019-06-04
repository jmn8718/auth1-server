FROM node:8.16.0-slim

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app

CMD [ "node", "src/bin/www" ]
