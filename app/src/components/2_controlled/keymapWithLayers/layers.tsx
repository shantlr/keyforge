'use client';

import { Keymap } from '@/components/providers/redux';
import clsx from 'clsx';
import { ComponentProps, useMemo } from 'react';
import { Tooltip } from '@/components/0_base/tooltips';
import { Button } from '@/components/0_base/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
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
  ...props
}: {
  layer: Keymap['layers'][number];
  active?: boolean;
  onDelete?: () => void;
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
        <Button
          onPress={() => {
            onDelete?.();
          }}
          className="px-[6px] text-[10px]"
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
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
  // return (
  //   <DragDropContext
  //     onDragEnd={(e) => {
  //       if (e.destination) {
  //         onLayerMove?.({
  //           srcIdx: items.length - e.source.index - 1,
  //           dstIdx: items.length - e.destination.index - 1,
  //         });
  //       }
  //     }}
  //   >
  //     <Droppable droppableId="layers">
  //       {(provided) => (
  //         <div
  //           className="space-y-1"
  //           {...provided.droppableProps}
  //           ref={provided.innerRef}
  //         >
  //           {items.map((l, idx) => {
  //             return (
  //               <Draggable
  //                 isDragDisabled={!onLayerMove}
  //                 key={l.id}
  //                 draggableId={l.id}
  //                 index={idx}
  //               >
  //                 {(provided, snapshot) => (
  //                   <LayerItem
  //                     ref={provided.innerRef}
  //                     {...provided.draggableProps}
  //                     {...provided.dragHandleProps}
  //                     style={provided.draggableProps.style}
  //                     layer={l}
  //                     key={idx}
  //                     isDragging={snapshot.isDragging}
  //                     active={selectedLayerId === l.id}
  //                     onPress={() => {
  //                       onSelectLayer?.(l.id);
  //                     }}
  //                     onDelete={
  //                       onLayerDelete
  //                         ? () => {
  //                             onLayerDelete(l);
  //                           }
  //                         : undefined
  //                     }
  //                   />
  //                 )}
  //               </Draggable>
  //             );
  //           })}
  //           {provided.placeholder}
  //         </div>
  //       )}
  //     </Droppable>
  //   </DragDropContext>
  // );
};
