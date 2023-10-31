'use server';

import { existingKeymap, keyboardInfo } from '@/lib/keyboards';

export const $$getExistingKeymap = async ({
  keyboardKey,
  keymap,
}: {
  keyboardKey: string;
  keymap: string;
}) => {
  const kb = await keyboardInfo.get(keyboardKey);
  if (!kb) {
    return null;
  }

  return existingKeymap.get(`${kb.path}/${keymap}`);
};

export const $$getKeyboard = async ({
  keyboardKey,
  keymap,
}: {
  keyboardKey: string;
  keymap?: string;
}) => {
  const kb = await keyboardInfo.get(keyboardKey);
  if (!kb) {
    return null;
  }

  if (!keymap) {
    keymap = kb.keymaps.includes('default') ? 'default' : kb.keymaps[0];
  }
  return {
    keyboard: kb,
    keymap: await existingKeymap.get(`${kb.path}/${keymap}`),
  };
};
