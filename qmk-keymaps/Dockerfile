FROM node:18-alpine3.18 as qmk_repo
RUN apk add git

WORKDIR /service
RUN git clone https://github.com/qmk/qmk_firmware.git ./qmk


#>>dogen
FROM alpine:3.12 AS jq
RUN apk add --update --no-cache jq

FROM node:18-alpine3.18 AS node-base

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
COPY tsconfig.build.json tsconfig.build.json
COPY tsconfig.json tsconfig.json
COPY src src
RUN yarn build
COPY cli cli
COPY --from=qmk_repo /service/qmk ./qmk
RUN ./cli -i ./qmk/quantum/keycodes.h ./qmk/keyboards /output/keyboards

FROM build AS service
CMD ./cli
#<<dogen
