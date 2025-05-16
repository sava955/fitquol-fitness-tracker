# build the angular app
FROM node:22-alpine as build

WORKDIR /app
COPY package.json .
RUN npm ci
COPY . .
RUN npm run build

# serve the angular app with nginx
FROM nginx:1.23-alpine
WORKDIR /user/share/nginx/html
RUN rm -rf *

#copy the built angular app from the build stage
COPY --from=build /app/dist/fiquol-fe/browser .
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
