import { KeyConfig } from '@/constants';
import { KeymapKeyDef, KeymapKeyParam } from '@/types';
import { FC } from 'react';

export type CustomKeyComponent = FC<{
  keyConf: KeyConfig;
  params?: KeymapKeyParam[] | null;
  layers?: { id: string; name: string }[];
  onUpdate?: (key: KeymapKeyDef) => void;
}>;
