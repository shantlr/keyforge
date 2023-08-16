import { mkdir, unlink, writeFile } from 'fs/promises';
import { KeyboardInfo, KeymapInput } from '../types';
import path from 'path';
import { formatKeymap } from './formatKeymap';
import { customAlphabet } from 'nanoid';
import { getKeyboardInfo } from './getKeyboardInfo';
import execa from 'execa';
import { deleteDir } from '../lib/deleteDir';

const randomKemapId = customAlphabet(
  '0123456789abcdefghijklmnopqrsuvwxyzABCDEFGHIJKLMNOPQRSUVWXYZ',
);

const assertKeymap = ({
  keyboardInfo,
  keymap,
}: {
  keymap: KeymapInput;
  keyboardInfo: KeyboardInfo;
}) => {
  if (
    !(keymap.layout in (keyboardInfo.layouts ?? {})) &&
    !(keymap.layout in (keyboardInfo.layout_aliases ?? {}))
  ) {
    throw new Error(`INVALID_INPUT_LAYOUT: ${keymap.layout} not found`);
  }

  const expectedNbKeys =
    keyboardInfo.layouts[Object.keys(keyboardInfo.layouts)[0]].layout.length;
  for (const l of keymap.layers) {
    if (l.keys.length !== expectedNbKeys) {
      throw new Error(
        `INVALID_LAYER_KEYS_COUNT: layer '${l.name}' has invalid number of keys, expected ${expectedNbKeys} keys but received ${l.keys.length} keys`,
      );
    }
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
  keyboardRev,
  keymapName,
  cwd,
}: {
  keyboardRev: string;
  keymapName: string;
  cwd: string;
}) => {
  console.log(`[compile-keymap] make ${keyboardRev}:${keymapName}`);
  await execa('make', [`${keyboardRev}:${keymapName}`], {
    stdio: 'inherit',
    cwd,
  });
  const binName = `${keyboardRev.replace(/\//g, '_')}_${keymapName}.bin`;
  return { binName };
};

export const compileKeymap = async ({
  keyboard,
  qmkCwd,
  keyboardsDir = path.resolve(qmkCwd, 'keyboards'),
  keymap,

  cleanBin = true,
  cleanKeymap = true,
}: {
  keymap: KeymapInput;
  keyboard: string;
  keyboardsDir?: string;
  qmkCwd: string;

  cleanKeymap?: boolean;
  cleanBin?: boolean;
}) => {
  const { info: keyboardInfo, keymapsPath } = await getKeyboardInfo({
    keyboardsDir,
    revPath: keyboard,
  });
  assertKeymap({ keymap, keyboardInfo });
  console.log(`[compile-qmk] keymap input verified.`);

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
      keyboardRev: keyboard,
      keymapName: generatedKeymap.keymapName,
    });
    console.log(`[compile-qmk]`);
    binPath = path.resolve(qmkCwd, binName);
  } finally {
    if (cleanKeymap) {
      await deleteDir(generatedKeymap.dir);
    }
    if (cleanBin && binPath) {
      await unlink(binPath);
    }
  }
};
