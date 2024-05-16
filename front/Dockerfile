FROM node:18-alpine

RUN mkdir /app
WORKDIR /app
COPY package.json .
RUN yarn add ts-node -g
RUN yarn install
COPY . .

EXPOSE 8000

CMD yarn run dev --host
