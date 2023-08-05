'use client';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Keymap } from '@/components/providers/redux';
import clsx from 'clsx';
import { ComponentProps, forwardRef, useMemo } from 'react';

const LayerItem = forwardRef<
  HTMLDivElement,
  {
    layer: Keymap['layers'][number];
    active?: boolean;
    onPress?: () => void;
  } & ComponentProps<'div'>
>(({ layer, active, onPress, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx('w-full text-sm rounded-sm text-center transition', {
        'bg-default text-mainbg hover:bg-default-lighter active:default-darker':
          !active,
        'bg-primary text-white ': active,
      })}
      onClick={onPress}
      {...props}
    >
      {layer.name}
    </div>
  );
});
LayerItem.displayName = 'LayerItem';

export const Layers = ({
  selectedLayerId,
  layers,
  onSelectLayer,
  onLayerMove,
}: {
  selectedLayerId: string;
  layers: Keymap['layers'];
  onSelectLayer?: (layerId: string) => void;
  onLayerMove?: (arg: { srcIdx: number; dstIdx: number }) => void;
}) => {
  const items = useMemo(() => [...layers].reverse(), [layers]);

  return (
    <DragDropContext
      onDragEnd={(e) => {
        if (e.destination) {
          onLayerMove?.({
            srcIdx: items.length - e.source.index - 1,
            dstIdx: items.length - e.destination.index - 1,
          });
        }
      }}
    >
      <Droppable droppableId="layers">
        {(provided) => (
          <div
            className="space-y-1"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {items.map((l, idx) => {
              return (
                <Draggable
                  isDragDisabled={!onLayerMove}
                  key={l.id}
                  draggableId={l.id}
                  index={idx}
                >
                  {(provided, snapshot) => (
                    <LayerItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={provided.draggableProps.style}
                      layer={l}
                      key={idx}
                      active={selectedLayerId === l.id}
                      onPress={() => {
                        onSelectLayer?.(l.id);
                      }}
                    />
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
