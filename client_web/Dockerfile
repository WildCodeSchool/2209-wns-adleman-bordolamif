FROM node:18.13-alpine

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN npm i

COPY public ./public
COPY index.html ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY src ./src
COPY tailwind.config.cjs ./
COPY postcss.config.cjs ./
COPY vite.config.ts ./

ARG REACT_APP_GRAPHQL_API_URL
ENV REACT_APP_GRAPHQL_API_URL ${REACT_APP_GRAPHQL_API_URL}

CMD npm start
