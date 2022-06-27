FROM node:16-slim

WORKDIR /usr/src/app

COPY package.json ./

RUN  npm install --only=production

COPY . ./

RUN npm run build

CMD ["npm","start:prod"]
