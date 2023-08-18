import path from 'path';
import { createCache, createSingleValueCache } from './ttlCache';
import { readFile } from 'fs/promises';
import { KeyboardInfo } from '@/types';
import { keyBy } from 'lodash';

const baseDir = './keyboards';

export const keyboardList = createSingleValueCache(async () => {
  try {
    const content = await readFile(path.resolve(baseDir, 'list.json'));

    const res = JSON.parse(content.toString()) as {
      use_path_initial_prefix: boolean;
      list: {
        name: string;
        key: string;
        qmkpath: string;
      }[];
    };

    return res.list.map((l) => ({
      name: l.name,
      key: l.key,
      qmkpath: l.qmkpath,
      path: res.use_path_initial_prefix ? `${l.key[0]}/${l.key}` : l.key,
    }));
  } catch (err) {
    if ((err as any)?.code === 'ENOENT') {
      console.log(err);
      console.warn(`dir '${path.resolve(baseDir)}' not found`);
      return [];
    }
    throw err;
  }
});

export const keyboardMap = createSingleValueCache(async () => {
  const list = await keyboardList.get();
  return keyBy(list, 'key');
});

export const keyboardOptions = createSingleValueCache(async () => {
  const list = await keyboardList.get();
  return list.map((item) => ({
    name: item.name,
    key: item.key,
    qmkpath: item.qmkpath,
  }));
});

export const keyboardInfo = createCache<
  string,
  KeyboardInfo & { path: string }
>(
  // @ts-ignore
  async (key: string) => {
    try {
      const m = await keyboardMap.get();

      const kb = m[key];
      if (!kb) {
        console.warn(`keyboard key '${key}' unknown`);
        return null;
      }

      const res = await readFile(path.resolve(baseDir, kb.path, 'info.json'));
      const info = JSON.parse(res.toString());
      return {
        ...info,
        path: kb.path,
      };
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
    max: 300,
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
