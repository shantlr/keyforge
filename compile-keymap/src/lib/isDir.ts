import { stat } from 'fs/promises';

export const isDir = async (p: string) => {
  try {
    const s = await stat(p);
    return s.isDirectory();
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
};
