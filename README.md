# Website of stura UHasselt

## Run the project

### Prerequisites 

- [docker](https://docs.docker.com/install/)
- [docker-compose](https://docs.docker.com/compose/install/)

1. Import `.env` file and `.certs/` directory into the top level of the project.
2. Run `docker-compose up --build -d`

## Running the project partially without docker

### Prerequisites 

- [NodeJS](https://nodejs.org/en/download/)

### API
For debugging or developing the api

1. Go to `api/`
2. Run `npm install`
3. Run `npm start`

### Web
For debugging or developing the web

1. Go to `web/`
2. Run `npm install`
3. Run `npm start`

## Issues

- When running without docker, the `.env` file is not set in the node envirnment
