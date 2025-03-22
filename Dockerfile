FROM node:20 as development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

FROM development as production

CMD ["npm", "run", "start:prod"]
