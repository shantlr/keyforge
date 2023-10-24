import { readdir } from 'fs/promises';
import path from 'path';

export const parseKeymaps = async (
  dir: string,
  onKeymap: (input: {
    dir: string;
    keymapPath: string;
  }) => Promise<void> | void,
) => {
  const files = await readdir(dir, { withFileTypes: true });
  const keymap = files.find((f) => f.name === 'keymap.c');

  if (keymap) {
    await onKeymap({ dir, keymapPath: path.resolve(dir, keymap.name) });
  } else {
    const subdirs = files.filter((f) => f.isDirectory());
    await Promise.all(
      subdirs.map(async (subdir) => {
        await parseKeymaps(path.resolve(dir, subdir.name), onKeymap);
      }),
    );
  }
};
