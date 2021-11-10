# FrontEnd

FrontEnd PeerPrep App.

### Local Development
Create a `.env` file with a single variable `REACT_APP_ENV=production` or `REACT_APP_ENV=development`, where the former is to point to our backend microservices deployed on AWS, the latter ot point to locally deployed instances of the backend microservices.

Run `yarn install` then `yarn start` to start the app at `localhost:3000`



### Deployment

For deployment of new version of peerprep frontend, run these in order

### `yarn predeploy`

Creates the build folder that needs to be served.

### `yarn build:prod`

This command builds a new docker image with the tag manasvegi/reactnginx.

### `yarn start:prod`

This command locally runs the docker image manasvegi/reactnginx with container name 'myreact' accessible at http://localhost:5000.

### `yarn stop:prod`

Stops the docker container that is running the react app and removes the container name.

### `docker push manasvegi/reactnginx`

Updates the docker image.

### `eb deploy peerprepUI`

Note: need to generalize this command so that all users can deploy to the aws elastic beanstalk.