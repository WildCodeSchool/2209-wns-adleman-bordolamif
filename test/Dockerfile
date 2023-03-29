FROM node:18.13-alpine

RUN apk --no-cache add curl
RUN apk add make g++ python3 git
RUN npm i -g node-pre-gyp

RUN mkdir /server
WORKDIR /server

COPY ./server/package.json ./package.json
COPY ./server/package-lock.json ./package-lock.json

RUN npm i

COPY ./server/tsconfig.json ./tsconfig.json
COPY ./server/src ./src

RUN mkdir /app
WORKDIR /app

COPY test/package*.json ./

RUN npm i

COPY test/jest.config.js ./
COPY test/dbSetup.ts ./
COPY test/tsconfig.json ./
COPY test/src ./src

CMD ["npm", "run", "test"]
