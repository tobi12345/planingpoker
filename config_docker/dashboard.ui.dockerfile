FROM node:14.2 AS build

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build
RUN npm run build:game

FROM nginx:stable

COPY --from=build /app/dist_ui_game/ /usr/share/nginx/html/

COPY ./config_nginx/compression.conf /etc/nginx/conf.d/
COPY ./config_nginx/default.conf /etc/nginx/conf.d/

COPY ./scripts/run_container.sh ./scripts/run_container.sh
RUN chmod +x scripts/run_container.sh

EXPOSE 80
ENTRYPOINT ["/bin/sh", "-c", "scripts/run_container.sh"]