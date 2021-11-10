# CommunicationsService 

This service purpose is to maintain text messaging between two users while connected in a room.

## Local Setup

1. Run `yarn install` to install all depedencies
2. Run `yarn start` to start the server using `Nodemon`. Server will start on port 7000 (by default)
3. Ensure you have `Redis` installed and running.

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

REDIS_LOCAL_HOSTNAME: Hostname of the local redis instance, usually just 'localhost'
REDIS_LOCAL_PORT: Redis local port, default 6379
REDIS_LOCAL_PW: Redis local password, default null

REDIS_REMOTE_HOSTNAME: Hostname of hte remote redis instance
REDIS_REMOTE_PORT: Redis Remote port. Usually 6379 too
REDIS_REMOTE_PW: Redis Remote instance password.
```

## DevOps / Containerization / Orchestration

**Relevant Commands**
- `docker build -t peerprep/comm:latest .`: (Re)Build Image Locally. Warning: Does not contain Redis as we typically point to hosted instance.
- `docker run -dp 7000:7000 --platform linux/amd64 peerprep/comm:latest`: Run standalone Docker Image (Typically in production mode)