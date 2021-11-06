# QuestionService

## Local Setup

1. Run `yarn install` to install all depedencies
2. Run `yarn start` to start the server using `Nodemon`. Server will start on port 8081 (by default)

## Local Development Guide

This project is equipped with `ESLint` and `Prettier` to enforce universal code styling and easy formatting.

To start, we recommend installing the `ESLint`(dbaeumer.vscode-eslint) and `Prettier`(esbenp.prettier-vscode) extensions on Visual Studio Code. Then, configure the following settings

- Editor: Format on Save Mode --> Turn ON
- Editor: Default Formatter --> Select Prettier - Code Formatter

**Relevant Commands**

- `yarn lint`: Use ESLint to check for any errors`
- `yarn lint --fix`: Use ESLint to auto-fix any errors highlighted
- `yarn test`: Run Unit Tests
- `mongoimport --db QuestionDB --collection questions --jsonArray data/dummy-questions.json`: Load Dummy Question Data to MongoDB

## DevOps

**Relevant Commands**

- `docker build -t qs:latest .`: (Re)Build Image Locally
- `docker run -dp 8081:8081 qs`: Run standalone Docker Image (Typically in production mode)
- `docker-compose build`: (Re)Build Docker Compose Application. Typically for local usage (as it attached a MongoDB Cluster)
- `docker-compose up -d`: Run composed Docker application in detached mode

## `.env` File

`.env` is _git ignored_ by default, but there exists a `.env.sample` you can use to copy into your actual `.env file`. Replace variables as you see appropriate

Here are the variables below and their explanations

```
ENV: `development` for local usage/dev, `production` for production use
JWT_SECRET_TOKEN: Secret Key to generate JWT
ATLAS_PASSWORD: MongoDB Atlas Password

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

## Database

This microservice uses `MongoDB` for its persistence store. The name of the database it is using is called `QuestionDB`, and it will have 2 collections - `questions` and `rooms`

In production, it uses `MongoDB Atlas`. The user with the configured administrative permissions is `cs3219`.

**Relevant Commands**

```
// Local Connection to DB
mongosh UserProfileDB

// connect to MongoDB Atlas via shell (password will be prompted)
mongosh "mongodb+srv://cluster0.afp4g.mongodb.net/QuestionDB" --username cs3219

// Load Dummy Data into Local MongoDB
mongoimport --db QuestionDB --collection questions --jsonArray data/dummy-questions.json


// Load Dummy Data into MongoDB Cloud
mongoimport --uri mongodb+srv://cs3219:<password>@cluster0.afp4g.mongodb.net/QuestionDB --collection questions --type json --file data/dummy-questions.json --jsonArray
```
