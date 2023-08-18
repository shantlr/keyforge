FROM node:18-alpine3.18 as base

FROM base as with_qmk
RUN apk add git py3-pip

RUN python3 -m pip install --user qmk
ENV PATH="$PATH:/root/.local/bin"

WORKDIR /compile-qmk
RUN git clone https://github.com/qmk/qmk_firmware.git ./qmk

RUN qmk setup -h ./qmk -y

FROM with_qmk as compile_keymaps

COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install
COPY ./tsconfig.json .
COPY ./tsconfig.build.json .
COPY ./src ./src

RUN yarn build
COPY cli cli

CMD sleep 5000000

# CMD ./cli \
#   -i ./qmk/quantum/keycodes.h \
#   ./qmk/keyboards \
#   ./output/keyboards