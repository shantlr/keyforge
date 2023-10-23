'use client';

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMemo, useState } from 'react';

import { Keymap } from '@/components/providers/redux';

import { LayersDragOverlay } from './dragOverlay';
import { LayerItem } from './item';

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
  const [dragged, setDragged] = useState<string | null>(null);

  return (
    <DndContext
      onDragStart={(e) => {
        setDragged(e.active.id as string);
      }}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(e) => {
        setDragged(null);
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
              isDragged={l.id === dragged}
              onNameChange={(e) => {
                onRenameLayer?.({
                  layerId: l.id,
                  name: e.target.value,
                });
              }}
              onClick={() => {
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
