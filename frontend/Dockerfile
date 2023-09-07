FROM node:lts AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY ./ ./
RUN yarn build

FROM nginx:1.25
COPY --from=build /app/build/ /usr/share/nginx/html/
