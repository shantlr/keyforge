import { useDroppable } from '@dnd-kit/core';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Item } from 'react-stately';

import { useOnDrop } from '@/components/0_base/dnd/context';
import { Select } from '@/components/0_base/select';
import { useRegisterHighlightedLayer } from '@/components/providers/keymap';

import { Key } from '../../key';

import { CustomKeyProps } from './types';

export const LayerKey = forwardRef<any, CustomKeyProps>(
  (
    {
      keyConf,
      params,
      layers,
      onUpdate,
      droppableId,
      droppableData,
      onDrop,
      droppableDepth,

      width: propsWidth,
      isDown: propsIsDown,

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

    // const selectRef = useRef<{ getWidth: () => number }>();
    const layerId = params?.[0]?.value as string | undefined;
    const registerHighlightedLayer = useRegisterHighlightedLayer();

    const isDown = propsIsDown || Boolean(droppableId && isOver);

    const [selectButton, setSelectButon] = useState<HTMLButtonElement | null>(
      null
    );
    const [selectWidth, setSelectWidth] = useState(0);

    useEffect(() => {
      if (!selectButton) {
        return;
      }

      setSelectWidth(selectButton.clientWidth);
      const obs = new ResizeObserver(() => {
        setSelectWidth(selectButton.clientWidth);
      });
      obs.observe(selectButton);
      return () => obs.disconnect();
    }, [selectButton]);

    const computedWidth = isDown ? Math.max(selectWidth + 10, 65) : propsWidth;

    return (
      <Key
        {...props}
        width={computedWidth}
        zIndex={isDown ? 10 : undefined}
        isDown={isDown}
        ref={ref}
        onMouseEnter={() => {
          registerHighlightedLayer(layerId);
        }}
        onMouseLeave={() => {
          registerHighlightedLayer(undefined);
        }}
      >
        <div
          ref={setNodeRef}
          className="overflow-hidden flex flex-col items-center w-full"
        >
          <div className="text-[9px]">{keyConf.title || keyConf.key}</div>
          {!layers?.length && (
            <div className="text-[9px] border border-dashed px-1 mx-[1px] rounded-sm border-secondary text-secondary">
              Layer
            </div>
          )}
          {layers?.length && (
            <Select
              buttonRef={setSelectButon}
              colorScheme="secondary"
              placeholder="Layer"
              size="sm"
              selectedKey={(params?.[0]?.value as string) ?? null}
              inputClassName="text-[8px]"
              onSelectionChange={(k) => {
                onUpdate?.({
                  key: keyConf.key,
                  params: [{ type: 'layer', value: k as string }],
                });
              }}
              aria-label="select layer"
            >
              {layers.map((l) => (
                <Item key={l.id} aria-label={l.name}>
                  {l.name}
                </Item>
              ))}
            </Select>
          )}
        </div>
      </Key>
    );
  }
);
LayerKey.displayName = 'LayerKey';
