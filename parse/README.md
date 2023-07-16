# Parse qmk

Parse qmk keyboards c files and extract keymaps as json

## Output keymap jsons for app dev

bash

```bash
docker build . -t parseqmk
docker run --mount type=bind,source=$(pwd)/../app/keyboards,target=/parse-qmk/output/keyboards parseqmk
```

fish

```fish
docker build . -t parseqmk
docker run --mount type=bind,source=$(pwd)/../app/keyboards,target=/parse-qmk/output/keyboards parseqmk
```
