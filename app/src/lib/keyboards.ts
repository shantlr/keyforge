import path from 'path';
import { createCache, createSingleValueCache } from './ttlCache';
import { readFile } from 'fs/promises';
import { KeyboardInfo } from '@/types';

const baseDir = './keyboards';

export const keyboards = createSingleValueCache(async () => {
  try {
    const content = await readFile(path.resolve(baseDir, 'list.json'));
    return JSON.parse(content.toString()) as {
      name: string;
      path: string;
    }[];
  } catch (err) {
    console.log(process.cwd());
    if ((err as any)?.code === 'ENOENT') {
      console.log(err);
      console.warn(`dir '${path.resolve(baseDir)}' not found`);
      return [];
    }
    throw err;
  }
});

export const keyboardInfo = createCache<string, KeyboardInfo>(
  // @ts-ignore
  async (key: string) => {
    try {
      const res = await readFile(path.resolve(baseDir, key, 'info.json'));
      return JSON.parse(res.toString());
    } catch (err) {
      if ((err as any)?.code === 'ENOENT') {
        console.warn(`keyboard not found '${key}'`);
        return null;
      }
      if (err instanceof SyntaxError) {
        console.warn(`keyboard not found '${key}'`);
        return null;
      }
    }
  },
  {
    max: 100,
  }
);

export type ExistingKeymap = {
  name: string;
  layout: string;
  layers: {
    name: string;
    keys: string[];
  }[];
};

export const existingKeymap = createCache<string, ExistingKeymap>(
  async (key: string) => {
    try {
      const res = await readFile(path.resolve(baseDir, key, 'layout.json'));
      return JSON.parse(res.toString());
    } catch (err) {
      if ((err as any)?.code === 'ENOENT') {
        console.warn(`keymap not found '${key}'`);
        return undefined;
      }
      if (err instanceof SyntaxError) {
        console.warn(`keymap not found '${key}'`);
        return undefined;
      }
    }
  },
  {
    max: 1000,
  }
);
