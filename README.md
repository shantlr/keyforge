# Setup local dev env

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