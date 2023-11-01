import {
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
} from '@fortawesome/free-solid-svg-icons';
import { ComponentProps, forwardRef } from 'react';

import { Droppable } from '@/components/0_base/droppable';
import { KEYS, getKeyConfFromDef } from '@/constants';
import { KeymapKeyDef } from '@/types';

import { Key } from '../key';

import { createIconKey } from './customKeys/iconKey';
import { KeyModifier } from './customKeys/keyModifier';
import { LayerKey } from './customKeys/layerKey';
import { CustomKeyComponent } from './customKeys/types';


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
  KC_UP: createIconKey(faCaretUp),
  KC_DOWN: createIconKey(faCaretDown),
  KC_LEFT: createIconKey(faCaretLeft),
  KC_RGHT: createIconKey(faCaretRight),
};

export const QMKKey = forwardRef<
  HTMLDivElement,
  {
    keyDef?: KeymapKeyDef | null;
    droppableId?: string;
    droppableData?: any;
  } & Omit<Partial<ComponentProps<CustomKeyComponent>>, 'keyConf'> &
    Omit<ComponentProps<typeof Key>, 'children' | 'onDrop'>
>(
  (
    {
      keyDef,
      layers,
      onUpdate,

      droppableId,
      droppableData,
      droppableDepth,
      onDrop,
      ...props
    },
    ref
  ) => {
    const kConf = getKeyConfFromDef(keyDef);

    const CustomComponent = kConf && CUSTOM_KEYS_COMPONENTS[kConf.key];

    if (CustomComponent) {
      return (
        <CustomComponent
          ref={ref}
          keyConf={kConf}
          layers={layers}
          params={typeof keyDef === 'object' ? keyDef?.params : null}
          onUpdate={onUpdate}
          onDrop={onDrop}
          droppableId={droppableId}
          droppableDepth={droppableDepth}
          droppableData={droppableData}
          {...props}
        />
      );
    }

    if (droppableId) {
      return (
        <Droppable
          id={droppableId}
          data={{
            ...droppableData,
            droppableDepth,
          }}
          onDrop={onDrop}
        >
          {({ isOver }) => (
            <Key ref={ref} {...props} isDown={isOver || props.isDown}>
              {kConf?.title || kConf?.key || 'N/A'}
            </Key>
          )}
        </Droppable>
      );
    }

    return (
      <Key ref={ref} {...props}>
        {kConf?.title || kConf?.key || 'N/A'}
      </Key>
    );
  }
);
QMKKey.displayName = 'QMKKey';
