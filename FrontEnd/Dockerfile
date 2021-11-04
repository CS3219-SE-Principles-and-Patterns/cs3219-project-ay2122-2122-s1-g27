FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

ADD /build/ .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
