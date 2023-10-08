import { readdir, rmdir, stat } from 'node:fs/promises';
import path from 'node:path';

export const deleteDir = async (dir: string) => {
  try {
    const s = await stat(dir);
    if (s.isDirectory()) {
      const files = await readdir(dir);
      await Promise.all(
        files.map((f) => {
          return deleteDir(path.resolve(dir, f));
        }),
      );
    }

    await rmdir(dir);
  } catch (err) {
    if (err?.code === 'ENOENT') {
      return;
    }
    throw err;
  }
};
