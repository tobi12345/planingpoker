# pp
A tool to play planing poker. Intended for remote sprint meetings

Link: https://pp.kleselcodes.de/


## Local 'Prod'


````
docker compose -f ./docker-compose.local.yml up
````

### Envs

````
# GameUi envs: <root_dir>/game.production.env
REACT_APP_BACKEND_BASE_URL=localhost:3001
REACT_APP_USE_SSL=false
````

````
# Backend envs: <root_dir>/production.env
PORT=3000
JWT_SECRET=klc71mIQmv17YkIf8vEU
````



## Dev

````
#compile TS
npm run watch

#start UI
npm run start:game 

#start backend
npm run start:backend

````

### Envs

````
# GameUi envs: <root_dir>/game.env
REACT_APP_BACKEND_BASE_URL=localhost:4001
REACT_APP_USE_SSL=false
````

````
# Backend envs: <root_dir>/development.env
PORT=4001
JWT_SECRET=klc71mIQmv17YkIf8vEU
````


## Prod

The prod docker-compose.yml requires a correctly setup traefik for kleselcodes.de or needs to be modified for your URL

````
docker compose up -d
````

### Envs

````
# GameUi envs: <root_dir>/game.production.env
REACT_APP_BACKEND_BASE_URL=pp.kleselcodes.de/api
REACT_APP_USE_SSL=true
````

````
# Backend envs: <root_dir>/production.env
PORT=3000
JWT_SECRET=<random_secret>
````