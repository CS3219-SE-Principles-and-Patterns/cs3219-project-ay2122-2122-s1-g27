# CollabSocketService 

This service purpose is to maintain collaborative editing of a Code Editor.

## Local Setup

1. Run `yarn install` to install all depedencies
2. Run `yarn start` to start the server using `Nodemon`. Server will start on port 5005 (by default)

## Local Development Guide

This project is equipped with `ESLint` and `Prettier` to enforce universal code styling and easy formatting.

To start, we recommend installing the `ESLint`(dbaeumer.vscode-eslint) and `Prettier`(esbenp.prettier-vscode) extensions on Visual Studio Code. Then, configure the following settings

- Editor: Format on Save Mode --> Turn ON
- Editor: Default Formatter --> Select Prettier - Code Formatter

**Relevant Commands**

- `yarn lint`: Use ESLint to check for any errors`
- `yarn lint --fix`: Use ESLint to auto-fix any errors highlighted

## `.env` File

`.env` is _git ignored_ by default, but there exists a `.env.sample` you can use to copy into your actual `.env file`. Replace variables as you see appropriate

Here are the variables below and their explanations`

```
ENV: `development` for local usage/dev, `production` for production use
PORT: Port that the server will startup and expose itself on
JWT_SECRET_TOKEN: Secret Key to generate JWT
QUESTION_SERVICE_LOCAL_URL: URL where the local QuestionService is hosted.
QUESTION_SERVICE_REMOTE_URL: URL of the deployed QuestionService on remote

REDIS_LOCAL_HOSTNAME: Hostname of the local redis instance, usually just 'localhost'
REDIS_LOCAL_PORT: Redis local port, default 6379
REDIS_LOCAL_PW: Redis local password, default null

REDIS_REMOTE_HOSTNAME: Hostname of hte remote redis instance
REDIS_REMOTE_PORT: Redis Remote port. Usually 6379 too
REDIS_REMOTE_PW: Redis Remote instance password.
```

## DevOps / Containerization / Orchestration

**Relevant Commands**

- `docker build -t peerprep/collab:latest .`: (Re)Build Image Locally
- `docker run -dp 5005:5005 QUESTION_SERVICE_DEPLOYED_URL=<QUESTION_SERVICE_URL> --platform linux/amd64 peerprep/collab:latest`: Run standalone Docker Image (Typically in production mode), If `QuestionService` is started locally, you may use `docker run -dp 5005:5005 --env QUESTION_SERVICE_DEPLOYED_URL=http://localhost:8081 --platform linux/amd64 peerprep/collab:latest`
