FROM node:18.13-alpine

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN ["npm", "install"]

COPY public ./public
COPY index.html ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY src ./src
COPY tailwind.config.cjs ./
COPY postcss.config.cjs ./
COPY vite.config.ts ./

CMD ["npm", "start"]
