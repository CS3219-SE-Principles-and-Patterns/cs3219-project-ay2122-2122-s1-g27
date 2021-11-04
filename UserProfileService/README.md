# UserProfileService

## Local Setup

1. Run `yarn install` to install all depedencies
2. Run `yarn start` to start the server using `Nodemon`. Server will start on port 8080 (by default)

## Local Development Guide

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

`.env` is _git ignored_ by default, but there exists a `.env.sample` you can use to copy into your actual `.env file`. Replace variables as you see appropriate

Here are the variables below and their explanations

```
JWT_SECRET_TOKEN: Secret Key to generate JWT
REFRESH_TOKEN: Secret Key to regenerate JWT Auth

ENV: `development` for local usage/dev, `production` for production use
DB_HOST: Host of the DB. `localhost` by default in local dev
DB_PORT: DB Connection Port. `27017` by default
DB_NAME: DB Name we are connecting to. UserProfileDB by default
DB_USER: DB Username credentials. Empty by default (for local dev)
DB_PASSWORD: DB Password credentials. Empty by default (for local dev)

ATLAS_PASSWORD: MongoDB Atlas Password

MONGODB_USER: Docker Compose MongoDB Username Credential
MONGODB_PASSWORD: Docker Compose MongoDB Password
MONGODB_LOCAL_PORT: Docker Compose MongoDB Connection Port

NODE_LOCAL_PORT: Port to use to connect to our app. 8080 by default
NODE_DOCKER_PORT: Port to use in our **Docker Container**. Also 8080 by default

QUESTION_SERVICE_LOCAL_URL: URL where the local QuestionService is hosted.
```

## Database

This microservice uses `MongoDB` for its persistence store. The name of the database it is using is called `UserProfileDB`, and it will have 2 collections - `users` and `match`

In production, it uses `MongoDB Atlas`. The user with the configured administrative permissions is `cs3219`.

**Relevant Commands**

```
// Local Connection to DB
mongosh UserProfileDB

// connect to MongoDB Atlas via shell (password will be prompted)
mongosh "mongodb+srv://cluster0.afp4g.mongodb.net/UserProfileDB" --username cs3219

// Load Dummy Data into Local MongoDB
mongoimport --db UserProfileDB --collection users --jsonArray data/dummy-users.json
mongoimport --db UserProfileDB --collection match --jsonArray data/dummy-matches.json


// Load Dummy Data into MongoDB Cloud
mongoimport --uri mongodb+srv://cs3219:<password>@cluster0.afp4g.mongodb.net/UserProfileDB --collection users --type json --file data/dummy-users.json --jsonArray
mongoimport --uri mongodb+srv://cs3219:<password>@cluster0.afp4g.mongodb.net/UserProfileDB --collection match --type json --file data/dummy-matches.json --jsonArray
```
