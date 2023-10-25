FROM alpine/git as clone_qmk
RUN git clone https://github.com/qmk/qmk_firmware.git /qmk_firmware

FROM ghcr.io/qmk/qmk_cli as base
RUN apt-get update && apt-get install -y curl
RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME "/root/.volta"
ENV PATH "$VOLTA_HOME/bin:$PATH"
RUN volta install node@18 yarn@1.22

FROM base as with_qmk
WORKDIR /compile-qmk

COPY --from=clone_qmk /qmk_firmware ./data/qmk_firmware
RUN qmk setup -H ./data/qmk_firmware -y

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