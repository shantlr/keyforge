'use client';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Keymap } from '@/components/providers/redux';
import clsx from 'clsx';
import { ComponentProps, forwardRef, useMemo } from 'react';
import { Tooltip } from '@/components/base/tooltips';
import { Button } from '@/components/base/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const LayerItem = forwardRef<
  HTMLDivElement,
  {
    layer: Keymap['layers'][number];
    active?: boolean;
    onPress?: () => void;
    onDelete?: () => void;
  } & ComponentProps<'div'>
>(({ layer, active, onPress, onDelete, ...props }, ref) => {
  return (
    <Tooltip
      delay={0}
      disableHideOnClick
      tooltip={
        onDelete ? (
          <Button
            onPress={() => {
              onDelete?.();
            }}
            className="px-[6px] text-[10px]"
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        ) : null
      }
    >
      <div
        ref={ref}
        className={clsx(
          'flex items-center justify-center h-input-md w-full text-sm rounded-sm text-center transition',
          {
            'bg-default text-mainbg hover:bg-default-lighter active:default-darker':
              !active,
            'bg-primary text-white ': active,
          }
        )}
        onClick={onPress}
        {...props}
      >
        {layer.name}
      </div>
    </Tooltip>
  );
});
LayerItem.displayName = 'LayerItem';

export const Layers = ({
  selectedLayerId,
  layers,
  onSelectLayer,
  onLayerMove,
  onLayerDelete,
}: {
  selectedLayerId: string;
  layers: Keymap['layers'];
  onSelectLayer?: (layerId: string) => void;
  onLayerMove?: (arg: { srcIdx: number; dstIdx: number }) => void;
  onLayerDelete?: (layer: Keymap['layers'][number]) => void;
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
                      onDelete={
                        onLayerDelete
                          ? () => {
                              onLayerDelete(l);
                            }
                          : undefined
                      }
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
