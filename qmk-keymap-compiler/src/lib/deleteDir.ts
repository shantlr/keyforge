import { readdir, rmdir, unlink } from 'fs/promises';
import { isDir } from './isDir';
import path from 'path';

export const deleteDir = async (dir: string) => {
  if (!(await isDir(dir))) {
    return;
  }
  const files = await readdir(dir, { withFileTypes: true });
  if (files.length) {
    await Promise.all(
      files.map(async (f) => {
        if (f.isDirectory()) {
          await deleteDir(path.resolve(dir, f.name));
        } else {
          await unlink(path.resolve(dir, f.name));
        }
      }),
    );
  }
  await rmdir(dir);
};
