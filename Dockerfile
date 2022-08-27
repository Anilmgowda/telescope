FROM node:14-alpine 

ARG BASE_URL
ARG PORT
ARG ENVIRONMENT

ENV BASE_URL=${BASE_URL}
ENV ENVIRONMENT=${ENVIRONMENT}
ENV PORT=${PORT}

WORKDIR /app

copy package.json package.json
copy package-lock.json package-lock.json

RUN npm install

COPY ..


cmd ["npm", "run", "start"]