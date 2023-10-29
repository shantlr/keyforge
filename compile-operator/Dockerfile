#>>dogen
FROM alpine:3.12 AS jq
RUN apk add --update --no-cache jq

FROM node:18-alpine3.17 AS node-base

# Extract minimal fields for dependencies installation
# This step avoid reinstalling node_modules due to field that is unrelated
FROM jq AS extract-pkg-deps
COPY package.json /tmp/package.json
RUN jq '{name, dependencies, devDependencies}' < /tmp/package.json > /tmp/deps.json

# Install node_modules
FROM node-base AS install-modules
WORKDIR /service
COPY --from=extract-pkg-deps /tmp/deps.json package.json
COPY yarn.lock yarn.lock
RUN yarn install --pure-lockfile --non-interactive --cache-folder ./.ycache && rm -rf ./.ycache

# Build
FROM node-base AS build
WORKDIR /service
COPY --from=install-modules /service/node_modules node_modules
COPY package.json package.json
COPY src src
COPY tsconfig.json tsconfig.json
RUN yarn build

FROM build AS service
CMD yarn start
EXPOSE 3022
#<<dogen
