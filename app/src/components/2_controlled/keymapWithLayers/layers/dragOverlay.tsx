import { DragOverlay, useDndContext } from '@dnd-kit/core';

import { Button } from '@/components/0_base/button';
import { InputButton } from '@/components/0_base/inputButton';

import { LayerItem } from './item';

export const LayersDragOverlay = ({
  layers,
}: {
  layers: { id: string; name: string }[];
}) => {
  const { active } = useDndContext();
  const dragLayer = active ? layers.find((l) => l.id === active?.id) : null;

  return (
    <DragOverlay>
      {dragLayer && (
        <InputButton
          colorScheme="default-filled"
          active
          value={dragLayer.name}
        />
      )}
    </DragOverlay>
  );
};
