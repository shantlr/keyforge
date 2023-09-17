import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ComponentProps, forwardRef } from 'react';
import { CustomKeyComponent } from './types';
import { Key } from '../../key';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Droppable } from '@/components/0_base/droppable';

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
