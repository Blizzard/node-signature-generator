FROM node:lts

WORKDIR /usr/src/app

ADD package.json .
ADD yarn.lock .

RUN npm install -g yarn
RUN yarn

ADD . .

CMD ["node", "server.js"]
