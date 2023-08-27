'use client';

import { Keymap } from '@/components/providers/redux';
import clsx from 'clsx';
import { ComponentProps, useMemo } from 'react';
import { Tooltip } from '@/components/0_base/tooltips';
import { Button } from '@/components/0_base/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { mergeProps } from 'react-aria';

const LayerItem = ({
  layer,
  active,
  onDelete,
  onDuplicateLayer,
  ...props
}: {
  layer: Keymap['layers'][number];
  active?: boolean;
  onDelete?: () => void;
  onDuplicateLayer?: () => void;
} & ComponentProps<'div'>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: layer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Tooltip
      ref={setNodeRef}
      delay={0}
      isDisabled={isDragging || !onDelete}
      placement="right"
      {...listeners}
      {...attributes}
      tooltip={
        <div className="flex space-x-1">
          <Button
            className="px-[6px] text-[10px] bg-mainbg"
            onPress={() => {
              onDuplicateLayer?.();
            }}
          >
            <FontAwesomeIcon icon={faCopy} />
          </Button>
          <Button
            onPress={() => {
              onDelete?.();
            }}
            className="px-[6px] text-[10px] bg-mainbg"
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      }
    >
      <div
        style={style}
        {...mergeProps(props, {
          className: clsx(
            'flex cursor-pointer items-center justify-center h-input-md w-full text-sm rounded-sm text-center transition',
            {
              'bg-default text-mainbg hover:bg-default-lighter active:default-darker':
                !active,
              'bg-primary text-white ': active,
            }
          ),
        })}
      >
        {layer.name}
      </div>
    </Tooltip>
  );
};

export const Layers = ({
  selectedLayerId,
  layers,
  onSelectLayer,
  onDuplicateLayer,
  onLayerMove,
  onLayerDelete,
}: {
  selectedLayerId: string;
  layers: Keymap['layers'];
  onSelectLayer?: (layerId: string) => void;
  onDuplicateLayer?: (layerId: string) => void;
  onLayerMove?: (arg: { srcIdx: number; dstIdx: number }) => void;
  onLayerDelete?: (layer: Keymap['layers'][number]) => void;
}) => {
  const items = useMemo(() => [...layers].reverse(), [layers]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(e) => {
        onLayerMove?.({
          srcIdx: layers.findIndex((l) => l.id === e.active.id) as number,
          dstIdx: layers.findIndex((l) => l.id === e.over?.id) as number,
        });
      }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {items.map((l, idx) => (
            <LayerItem
              layer={l}
              key={idx}
              active={selectedLayerId === l.id}
              onPointerDown={() => {
                onSelectLayer?.(l.id);
              }}
              onDuplicateLayer={() => {
                onDuplicateLayer?.(l.id);
              }}
              onDelete={
                onLayerDelete
                  ? () => {
                      onLayerDelete(l);
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
