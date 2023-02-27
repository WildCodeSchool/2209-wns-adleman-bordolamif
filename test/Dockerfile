FROM node:18.13-alpine

RUN mkdir /server
WORKDIR /server

RUN mkdir /app
WORKDIR /app

COPY test/package*.json ./
COPY test/jest.config.ts ./
RUN npm install

COPY test/tsconfig.json ./
COPY test/src ./src

CMD ["npm", "run", "test"]
