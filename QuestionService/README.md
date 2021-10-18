# QuestionService

## Local Setup

1. Run `yarn install` to install all depedencies
2. Run `yarn start` to start the server using `Nodemon`. Server will start on port 8081 (by default)

## Development Guide

This project is equipped with `ESLint` and `Prettier` to enforce universal code styling and easy formatting.

To start, we recommend installing the `ESLint`(dbaeumer.vscode-eslint) and `Prettier`(esbenp.prettier-vscode) extensions on Visual Studio Code. Then, configure the following settings

- Editor: Format on Save Mode --> Turn ON
- Editor: Default Formatter --> Select Prettier - Code Formatter

**Relevant Commands**

- `yarn lint`: Use ESLint to check for any errors`
- `yarn lint --fix`: Use ESLint to auto-fix any errors highlighted
- `yarn test`: Run Unit Tests

## DevOps

This app components (MongoDB and NodeJS) is containerized using `Docker-Compose`.

**Relevant Commands**

- `docker-compose build`: (Re)Build Docker Image
- `docker-compose up -d`: Run composed Docker Image

## `.env` File

`.env` is _git ignored_ by default, but there exists a `.env.sample` you can use to copy into your actual `.env file`. Replacing Variables that you see appropriate

Here are the variables below and their explanations

```
DB_HOST: Host of the DB. `localhost` by default in local dev
DB_PORT: DB Connection Port. `27017` by default
DB_NAME: DB Name we are connecting to. QuestionDB by default
DB_USER: DB Username credentials. Empty by default (for local dev)
DB_PASSWORD: DB Password credentials. Empty by default (for local dev)

MONGODB_USER: Docker Compose MongoDB Username Credential
MONGODB_PASSWORD: Docker Compose MongoDB Password
MONGODB_LOCAL_PORT: Docker Compose MongoDB Connection Port

NODE_LOCAL_PORT: Port to use to connect to our app. 8081 by default
NODE_DOCKER_PORT: Port to use in our **Docker Container**. Also 8081 by default
```
