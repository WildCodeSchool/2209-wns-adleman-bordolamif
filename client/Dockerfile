FROM node:lts-alpine

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN npm i

COPY index.html ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY src ./src
COPY public ./public
COPY tailwind.config.cjs ./
COPY postcss.config.cjs ./
COPY vite.config.ts ./

CMD npm start
