import { mkdir, unlink, writeFile } from 'fs/promises';
import { KeyboardInfo, KeymapInput } from '../types';
import path from 'path';
import { formatKeymap } from './formatKeymap';
import { nanoid } from 'nanoid';
import { getKeyboardInfo } from './getKeyboardInfo';
import { execa } from 'execa';

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
  const id = nanoid();

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
  await execa(`make ${keyboardRev}:${keymapName}`, {
    stdio: 'inherit',
    cwd,
  });
  const binName = `${keyboardRev.replace(/\//g, '_')}_${keymapName}.bin`;
  return { binName };
};

export const compileKeymap = async ({
  keyboard,
  cwd,
  keyboardsDir = path.resolve(cwd, 'keyboards'),
  keymap,

  cleanBin,
  cleanKeymap,
}: {
  keymap: KeymapInput;
  keyboard: string;
  keyboardsDir?: string;
  cwd: string;

  cleanKeymap?: boolean;
  cleanBin?: boolean;
}) => {
  const { info: keyboardInfo, keymapsPath } = await getKeyboardInfo({
    keyboardsDir,
    revPath: keyboard,
  });
  assertKeymap({ keymap, keyboardInfo });

  const generatedKeymap = await generateKeymap({
    keyboardName: keyboardInfo.keyboard_name,
    keymap,
    keymapsPath,
  });

  let binPath: string = null;
  try {
    const { binName } = await compileFirmwareFromKeymapFolder({
      cwd,
      keyboardRev: keyboard,
      keymapName: generatedKeymap.keymapName,
    });
    binPath = path.resolve(cwd, binName);
  } finally {
    if (cleanKeymap) {
      await unlink(generatedKeymap.dir);
    }
    if (cleanBin && binPath) {
      await unlink(binPath);
    }
  }
};
