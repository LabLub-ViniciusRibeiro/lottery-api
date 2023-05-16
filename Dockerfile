FROM node:18-alpine
WORKDIR /app
COPY ./package*.json ./
COPY . .
RUN apk update && apk add bash
RUN npm install
EXPOSE 3333