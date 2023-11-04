# Keyforge

Edit your qmk keymap and download a compiled firmware directly from your browser.

Available at http://keyforge.shantr.dev

## Host it yourself

[docker-compose.yml](./docker-compose.yml)

## Keymaps json

You can get the keymaps json parsed from qmk repo using this image

```bash
CONTAINER_ID=$(docker create shantry/keyforge-qmk-keymaps) && docker cp $CONTAINER_ID:/output/keyboards ./keyboards && docker rm $CONTAINER_ID
```
