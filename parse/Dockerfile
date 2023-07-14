FROM node:18-alpine3.18 as base


FROM base as with_qmk
RUN apk add git

WORKDIR /parse-qmk
RUN git clone https://github.com/qmk/qmk_firmware.git ./qmk

FROM with_qmk as parse_keymaps

COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install
COPY ./tsconfig.json .
COPY ./jest.config.js .
COPY ./src .
COPY ./cli ./cli

RUN yarn build

CMD ./cli \
  -i ./qmk/quantum/keycodes.h \
  ./qmk/keyboards \
  ./output/keyboards