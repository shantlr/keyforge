import path from 'path';

export const isSubDir = (parentDir: string, subDir: string) => {
  const rel = path.relative(parentDir, subDir);
  return Boolean(rel && !rel.startsWith('..') && !path.isAbsolute(rel));
};
