import path from 'path';
import { isDir } from '../lib/isDir';
import { KeyboardInfo } from '../types';
import { readFile, readdir } from 'fs/promises';
import { isSubDir } from '../lib/isSubDir';

export const getKeyboardInfo = async ({
  revPath,
  keyboardsDir,
}: {
  revPath: string;
  keyboardsDir: string;
}): Promise<{
  info: KeyboardInfo;
  keyboardRevPath: string;
  keymapsPath: string;
}> => {
  if (
    !(await isDir(keyboardsDir)) ||
    !isSubDir(keyboardsDir, path.resolve(keyboardsDir, revPath))
  ) {
    throw new Error(`INVALID_KEYBOARDS_PATH: '${keyboardsDir}'`);
  }
  const paths = revPath.split('/');

  let info = {};
  let keyboardRevPath: string;
  let keymapsPath: string;

  let currentPath = keyboardsDir;
  for (let pathElem of paths) {
    let p = path.resolve(currentPath, pathElem);
    const dir = await readdir(p, { withFileTypes: true });
    currentPath = p;

    const keymapFd = dir.find((f) => f.name === 'keymaps' && f.isDirectory());
    if (keymapFd) {
      keymapsPath = path.resolve(p, keymapFd.name);
    }

    const isKeyboardFolder = dir.some(
      (d) => d.name === 'rules.mk' && d.isFile(),
    );

    // merge info.json if existing
    const infoFd = dir.find((d) => d.name === 'info.json' && d.isFile());
    if (infoFd) {
      try {
        const i = JSON.parse(
          (await readFile(path.resolve(p, infoFd.name))).toString(),
        );
        Object.assign(info, i);
      } catch (err) {
        if (err instanceof SyntaxError) {
          console.warn(`Failed to parse '${path.resolve(p, infoFd.name)}'`);
        } else {
          throw err;
        }
      }
    }

    if (isKeyboardFolder) {
      keyboardRevPath = p;
    }
    continue;
  }

  return {
    info: info as KeyboardInfo,
    keyboardRevPath,
    keymapsPath: keymapsPath || path.resolve(keyboardRevPath, 'keymaps'),
  };
};
