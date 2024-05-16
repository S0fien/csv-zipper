FROM node:18-alpine

RUN mkdir /app
WORKDIR /app
COPY package.json .
RUN yarn add ts-node -g
RUN yarn install

COPY src src
COPY tsconfig.json .
EXPOSE 5599

CMD yarn run dev
