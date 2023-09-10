'use client';

import { Keymap } from '@/components/providers/redux';
import { useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { LayerItem } from './item';
import { LayersDragOverlay } from './dragOverlay';

export const Layers = ({
  selectedLayerId,
  layers,
  onSelectLayer,
  onDuplicateLayer,
  onRenameLayer,
  onLayerMove,
  onLayerDelete,
}: {
  selectedLayerId: string;
  layers: Keymap['layers'];
  onSelectLayer?: (layerId: string) => void;
  onDuplicateLayer?: (layerId: string) => void;
  onRenameLayer?: (arg: { layerId: string; name: string }) => void;
  onLayerMove?: (arg: { srcIdx: number; dstIdx: number }) => void;
  onLayerDelete?: (layer: Keymap['layers'][number]) => void;
}) => {
  const items = useMemo(() => [...layers].reverse(), [layers]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
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
              onNameChange={(e) => {
                onRenameLayer?.({
                  layerId: l.id,
                  name: e.target.value,
                });
              }}
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
      <LayersDragOverlay layers={layers} />
    </DndContext>
  );
};
