FROM node:20.12.2

WORKDIR /blog-app

COPY package.json ./

RUN npm install

COPY . ./

EXPOSE 5500

CMD [ "npm", "start" ]
