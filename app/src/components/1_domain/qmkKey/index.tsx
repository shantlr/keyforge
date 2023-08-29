import { ComponentProps, forwardRef } from 'react';
import { Key } from '../key';
import { KEYS, getKeyConfFromDef } from '@/constants';
import { KeymapKeyDef } from '@/types';
import { CustomKeyComponent } from './customKeys/types';
import { LayerKey } from './customKeys/LayerKey';
import { KeyModifier } from './customKeys/KeyModifier';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
} from '@fortawesome/free-solid-svg-icons';

const CUSTOM_KEYS_COMPONENTS: Record<string, CustomKeyComponent> = {
  ...KEYS.filter((k) => 'group' in k && k.group === 'layer').reduce(
    (acc, keyConfig) => {
      acc[keyConfig.key] = LayerKey;
      return acc;
    },
    {} as Record<string, CustomKeyComponent>
  ),
  ...KEYS.filter((k) => 'group' in k && k.group === 'modifier').reduce(
    (acc, keyConfig) => {
      acc[keyConfig.key] = KeyModifier;
      return acc;
    },
    {} as Record<string, CustomKeyComponent>
  ),
  KC_UP: () => <FontAwesomeIcon icon={faCaretUp} />,
  KC_DOWN: () => <FontAwesomeIcon icon={faCaretDown} />,
  KC_LEFT: () => <FontAwesomeIcon icon={faCaretLeft} />,
  KC_RGHT: () => <FontAwesomeIcon icon={faCaretRight} />,
};

export const QMKKey = forwardRef<
  HTMLDivElement,
  {
    keyDef?: KeymapKeyDef | null;
  } & Omit<Partial<ComponentProps<CustomKeyComponent>>, 'keyConf'> &
    Omit<ComponentProps<typeof Key>, 'children'>
>(({ keyDef, layers, onUpdate, ...props }, ref) => {
  const kConf = getKeyConfFromDef(keyDef);

  const CustomComponent = kConf && CUSTOM_KEYS_COMPONENTS[kConf.key];

  return (
    <Key ref={ref} {...props}>
      {CustomComponent ? (
        <CustomComponent
          keyConf={kConf}
          params={typeof keyDef === 'object' ? keyDef?.params : null}
          layers={layers}
          onUpdate={onUpdate}
        />
      ) : (
        kConf?.title || kConf?.key || 'N/A'
      )}
    </Key>
  );
});
QMKKey.displayName = 'QMKKey';
