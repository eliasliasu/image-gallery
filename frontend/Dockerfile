FROM node:20-alpine3.19

WORKDIR /app

EXPOSE 3000

COPY package*.json ./

RUN npm install --silent

COPY . ./

CMD ["npm", "start"]