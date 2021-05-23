FROM node:14.2 AS build

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build

EXPOSE 3000
ENTRYPOINT ["node"]