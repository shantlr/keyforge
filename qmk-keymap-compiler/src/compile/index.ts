import { mkdir, unlink, writeFile } from 'fs/promises';
import { KeyboardInfo, KeymapInput } from '../types';
import path from 'path';
import { formatKeymap } from './formatKeymap';
import { customAlphabet } from 'nanoid';
import { getKeyboardInfo } from './getKeyboardInfo';
import execa from 'execa';
import { deleteDir } from '../lib/deleteDir';
import { isFileExists } from '../lib/isFileExists';

const randomKemapId = customAlphabet(
  '0123456789abcdefghijklmnopqrsuvwxyzABCDEFGHIJKLMNOPQRSUVWXYZ',
);

const assertKeymap = ({
  keyboardInfo,
  keymap,
}: {
  qmkCwd: string;
  keymap: KeymapInput;
  keyboardInfo: KeyboardInfo;
}) => {
  if (
    !(keymap.layout in (keyboardInfo.layouts ?? {})) &&
    !(keymap.layout in (keyboardInfo.layout_aliases ?? {}))
  ) {
    throw new Error(`INVALID_INPUT_LAYOUT: ${keymap.layout} not found`);
  }

  const expectedNbKeys = keyboardInfo.layouts[keymap.layout].layout.length;
  for (const l of keymap.layers) {
    if (l.keys.length !== expectedNbKeys) {
      throw new Error(
        `INVALID_LAYER_KEYS_COUNT: layer '${l.name}' has invalid number of keys, expected ${expectedNbKeys} keys but received ${l.keys.length} keys`,
      );
    }
    l.keys.forEach((key) => {
      if (typeof key === 'object') {
        key?.params.forEach((param) => {
          if (
            param.type === 'layer' &&
            !keymap.layers.some((l) => l.id === param.value)
          ) {
            throw new Error(
              `INVALID_LAYER_REF: unknown layer '${l.id}' used in key`,
            );
          }
        });
      }
    });
  }
};

const generateKeymap = async ({
  keyboardName,
  keymap,
  keymapsPath,
}: {
  keyboardName: string;
  keymap: KeymapInput;
  keymapsPath: string;
}): Promise<{ keymapName: string; dir: string }> => {
  const formattedKeymap = formatKeymap({
    keyboardName,
    ...keymap,
  });
  const id = randomKemapId();

  const dir = path.resolve(keymapsPath, id);
  await mkdir(dir);
  await writeFile(path.resolve(dir, `keymap.c`), formattedKeymap);
  await writeFile(path.resolve(dir, `config.h`), '');

  return {
    keymapName: id,
    dir,
  };
};

const compileFirmwareFromKeymapFolder = async ({
  keyboardQmkPath,
  keymapName,
  cwd,
}: {
  keyboardQmkPath: string;
  keymapName: string;
  cwd: string;
}) => {
  console.log(`[compile-qmk] make ${keyboardQmkPath}:${keymapName}`);
  await execa('make', [`${keyboardQmkPath}:${keymapName}`], {
    stdio: 'inherit',
    cwd,
  });
  const baseName = `${keyboardQmkPath.replace(/\//g, '_')}_${keymapName}`;

  const binName = `${baseName}.bin`;
  if (await isFileExists(path.resolve(cwd, binName))) {
    return { binName };
  }
  const hexName = `${baseName}.hex`;
  if (await isFileExists(path.resolve(cwd, hexName))) {
    return { binName: hexName };
  }

  throw new Error(`BIN_NOT_FOUND`);
};

export const compileKeymap = async ({
  qmkCwd,
  keyboardsDir = path.resolve(qmkCwd, 'keyboards'),
  keymap,

  onBin,

  cleanBin = true,
  cleanKeymap = true,
}: {
  keymap: KeymapInput;
  keyboardsDir?: string;
  qmkCwd: string;

  onKeymap?: () => Promise<void>;
  onBin?: (input: { binPath: string }) => Promise<void>;

  cleanKeymap?: boolean;
  cleanBin?: boolean;
}) => {
  const { info: keyboardInfo, keymapsPath } = await getKeyboardInfo({
    keyboardsDir,
    revPath: keymap.keyboardQmkPath,
  });
  assertKeymap({ qmkCwd, keymap, keyboardInfo });
  console.log(`[compile-qmk] keymap input validated.`);

  const generatedKeymap = await generateKeymap({
    keyboardName: keyboardInfo.keyboard_name,
    keymap,
    keymapsPath,
  });
  console.log(`[compile-qmk] keymap generated at ${generatedKeymap.dir}.`);

  let binPath: string = null;
  try {
    const { binName } = await compileFirmwareFromKeymapFolder({
      cwd: qmkCwd,
      keyboardQmkPath: keymap.keyboardQmkPath,
      keymapName: generatedKeymap.keymapName,
    });
    console.log(`[compile-qmk] done`);
    binPath = path.resolve(qmkCwd, binName);
    if (onBin) {
      onBin({ binPath });
    }
  } finally {
    if (cleanKeymap) {
      await deleteDir(generatedKeymap.dir);
    }
    if (cleanBin && binPath) {
      await unlink(binPath);
    }
  }
};
