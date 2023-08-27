import { KeymapKeyDef, KeymapKeyParam } from '@/types';
import { FC } from 'react';

export type CustomKeyComponent = FC<{
  params: KeymapKeyParam[] | null;
  layers?: { id: string; name: string }[];
  onUpdate?: (key: KeymapKeyDef) => void;
}>;
