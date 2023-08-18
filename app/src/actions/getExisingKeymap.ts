'use server';

import { existingKeymap } from '@/lib/keyboards';

export const $$getExistingKeymap = async ({
  keyboard,
  keymap,
}: {
  keyboard: string;
  keymap: string;
}) => {
  console.log(keyboard, keymap);
  return existingKeymap.get(`${keyboard}/${keymap}`);
};
