import { getKeyConfFromDef } from '@/constants';
import { KeymapKeyDef } from '@/types';

export const formatKeyDef = (
  keyDef: KeymapKeyDef | null | undefined
): string => {
  if (!keyDef) {
    return '';
  }

  const keyConf = getKeyConfFromDef(keyDef);
  if (typeof keyDef === 'string') {
    return keyConf?.title ?? keyConf?.key ?? keyDef;
  }
  return `${keyConf?.title ?? keyConf?.key ?? keyDef.key}(${keyDef.params
    .map((p) => {
      if (p.type === 'layer') {
        return '';
      }
      return formatKeyDef(p.value);
    })
    .join(',')})`;
};
