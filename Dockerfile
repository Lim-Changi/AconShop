FROM node:16-alpine AS build

# Create app directory
WORKDIR /app/acon

COPY package*.json /app/acon/
RUN npm ci
COPY . /app/acon/
RUN npm run build



FROM node:16-alpine

ENV NODE_ENV=production
WORKDIR /app/acon

COPY --from=build /app/acon/dist /app/acon/dist
COPY --from=build /app/acon/node_modules /app/acon/node_modules
COPY --from=build /app/acon/package.json /app/acon/package.json

EXPOSE 8000
ENTRYPOINT [ "node" ]
CMD [ "dist/src/main.js" ]