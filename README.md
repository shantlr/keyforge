# Keyforge

Edit your qmk keymap and download a compiled firmware directly from your browser.

Available at http://keyforge.shantr.dev

## Setup local dev env

1. Generate keymaps

See [parse script](./parse/README.md)

2. Setup app env file

Create a `./app/.env.local` file to use local runner for firmware compilation jobs

```.env
RUNNER_MODE=local
RUNNER_LOCAL_PATH=../compile-qmk-keymap
MAX_PARALLEL_JOB=1
```

3. Start app

```bash
cd ./app && yarn dev
```

## Host it yourself

[docker-compose.yml](./docker-compose.yml)

## Keymaps json

You can get the keymaps json parsed from qmk repo using this image

```bash
CONTAINER_ID=$(docker create shantry/keyforge-qmk-keymaps) && docker cp $CONTAINER_ID:/output/keyboards ./keyboards && docker rm $CONTAINER_ID
```
