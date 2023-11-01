import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentProps, forwardRef } from 'react';

import { Droppable } from '@/components/0_base/droppable';

import { Key } from '../../key';

import { CustomKeyComponent } from './types';

export const createIconKey = (icon: IconDefinition) => {
  const C = forwardRef<any, ComponentProps<CustomKeyComponent>>(
    (
      {
        keyConf,
        params,
        layers,
        onUpdate,
        droppableDepth,
        droppableId,
        droppableData,
        onDrop,
        ...p
      },
      ref
    ) => {
      if (droppableId) {
        return (
          <Droppable id={droppableId} data={droppableData} onDrop={onDrop}>
            <Key {...p} ref={ref}>
              <FontAwesomeIcon icon={icon} />
            </Key>
          </Droppable>
        );
      }

      return (
        <Key {...p} ref={ref}>
          <FontAwesomeIcon icon={icon} />
        </Key>
      );
    }
  );
  C.displayName = `IconKey${icon.iconName}`;
  return C;
};
