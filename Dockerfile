ARG PORT=3000

FROM node:14.17-alpine As development

ENV NODE_ENV=development

WORKDIR /usr/src

ENV PATH /usr/src/node_modules/.bin/:$PATH

COPY package*.json ./

RUN yarn && yarn cache clean --force

WORKDIR /usr/src/app

COPY . .

EXPOSE ${PORT}

FROM development as builder

RUN yarn build