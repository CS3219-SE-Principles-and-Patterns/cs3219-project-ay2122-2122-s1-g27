FROM mhart/alpine-node:16

ENV ENV=production

WORKDIR /app
COPY . .
EXPOSE 5005
RUN yarn install
CMD yarn start