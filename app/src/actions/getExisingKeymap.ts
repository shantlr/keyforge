'use server';

import { existingKeymap } from '@/lib/keyboards';

export const getExistingKeymap = async ({
  keyboard,
  keymap,
}: {
  keyboard: string;
  keymap: string;
}) => {
  return existingKeymap.get(`${keyboard}/${keymap}`);
};
