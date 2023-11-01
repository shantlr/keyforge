import { stat } from 'fs/promises';

export const isFileExists = async (filePath: string) => {
  try {
    const res = await stat(filePath);
    return res.isFile();
  } catch {
    return false;
  }
};
