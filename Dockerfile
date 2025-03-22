FROM node:20 AS development

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

FROM development AS production

RUN npm run build

CMD ["npm", "run", "start:prod"]
