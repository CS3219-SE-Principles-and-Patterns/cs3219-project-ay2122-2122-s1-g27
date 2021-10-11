# UserProfileService

## Setup

1. Run `yarn install` to install all depedencies
2. Run `yarn start` to start the server using `Nodemon`.

## Development Guide

This project is equipped with `ESLint` and `Prettier` to enforce universal code styling and easy formatting.

To start, we recommend installing the `ESLint`(dbaeumer.vscode-eslint) and `Prettier`(esbenp.prettier-vscode) extensions on Visual Studio Code. Then, configure the following settings

- Editor: Format on Save Mode --> Turn ON
- Editor: Default Formatter --> Select Prettier - Code Formatter

**Relevant Commands**

- `yarn lint`: Use ESLint to check for any errors`
- `yarn lint --fix`: Use ESLint to auto-fix any errors highlighted

### `.env` File

Place the following variables under this file

```
JWT_SECRET_TOKEN=???
REFRESH_TOKEN=???
```
