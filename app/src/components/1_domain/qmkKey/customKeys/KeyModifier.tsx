import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import { forwardRef, useId, useMemo } from 'react';

import { QMKKey } from '..';
import { KEY_DEFAULT_HEIGHT, KEY_DEFAULT_WIDTH, Key } from '../../key';
import { formatKeyDef } from '../formatKeyDef';
import { Button } from '@/components/0_base/button';
import { useOnDrop } from '@/components/0_base/dnd/context';
import { useDroppableContainer } from '@/components/0_base/droppableGroup';
import { KeymapKeyParam } from '@/types';

import { CustomKeyProps } from './types';

const computeWidth = ({
  width,
  shouldExpand,
  params,
}: {
  width: number;
  shouldExpand: boolean;
  params: KeymapKeyParam[] | null | undefined;
}): number => {
  if (!shouldExpand || !params?.length) {
    return width;
  }

  return (
    width +
    params.reduce((acc, param) => {
      if (
        param.type === 'key' &&
        param.value &&
        typeof param.value === 'object'
      ) {
        return (
          acc +
          computeWidth({ width, params: param.value.params, shouldExpand })
        );
      }
      return acc + width;
    }, 0)
  );
};

export const KeyModifier = forwardRef<any, CustomKeyProps>(
  (
    {
      keyConf,
      params,
      isDown,
      onUpdate,
      width = KEY_DEFAULT_WIDTH,
      height = KEY_DEFAULT_HEIGHT,
      className,

      droppableId,
      droppableData,
      onDrop,
      droppableDepth,
      ...props
    },
    ref
  ) => {
    const { setNodeRef, isOver } = useDroppable({
      id: droppableId as string,
      data: {
        ...(droppableData || null),
        droppableDepth: droppableDepth ?? 0,
      },
      disabled: !droppableId,
    });
    useOnDrop(droppableId || null, (e) => {
      if (onUpdate && e.data.active.data.current?.type === 'key') {
        e.stopPropagation();
        onUpdate?.(e.data.active.data.current.keyDef);
      }
    });

    const { isOver: isOverGroup, setNodeRef: setContainerNodeRef } =
      useDroppableContainer();

    const shouldExpand = Boolean(
      params && droppableId && (isOver || isOverGroup)
    );

    const paramKey = params?.[0]?.value;
    const paramId = useId();

    const w = useMemo(() => {
      return computeWidth({ width, params, shouldExpand });
    }, [shouldExpand, params, width]);

    return (
      <Key
        ref={(e) => {
          if (typeof ref === 'function') {
            ref(e);
          } else if (ref) {
            ref.current = e;
          }

          setNodeRef?.(e);
        }}
        width={w}
        height={!shouldExpand ? height : height + 16}
        className={clsx(className, {
          'z-[50]': shouldExpand,
          'z-0': !shouldExpand,
        })}
        isDown={isDown || shouldExpand}
        {...props}
      >
        <div
          className={clsx('overflow-hidden flex items-center relative', {
            'flex-col': !shouldExpand,
            'space-x-2': shouldExpand,
          })}
        >
          <div className="text-[9px]">{keyConf.title || keyConf.key}</div>
          <div ref={setContainerNodeRef}>
            {shouldExpand ? (
              <QMKKey
                width={width - 4}
                height={height - 8}
                keyDef={paramKey}
                droppableDepth={(droppableDepth ?? 0) + 1}
                droppableId={`key_params_${paramId}`}
                droppableData={{
                  type: 'param',
                }}
                onUpdate={(e) => {
                  onUpdate?.({
                    key: keyConf.key,
                    params: [
                      {
                        type: 'key',
                        value: e,
                      },
                    ],
                  });
                }}
                onDrop={(e) => {
                  const dropped = e.data.active.data.current as any;
                  if (dropped?.type === 'key') {
                    e.stopPropagation();
                    onUpdate?.({
                      key: keyConf.key,
                      params: [
                        {
                          type: 'key',
                          value: dropped.keyDef,
                        },
                      ],
                    });
                  }
                }}
              />
            ) : (
              <Button size="sm" colorScheme="secondary" className="text-[8px]">
                {formatKeyDef(paramKey) || 'Key'}
              </Button>
            )}
          </div>
        </div>
      </Key>
    );
  }
);
KeyModifier.displayName = 'KeyModifier';
