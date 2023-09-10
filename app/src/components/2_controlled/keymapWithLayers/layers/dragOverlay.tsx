import { DragOverlay, useDndContext } from '@dnd-kit/core';
import { LayerItem } from './item';
import { Button } from '@/components/0_base/button';
import { InputButton } from '@/components/0_base/inputButton';

export const LayersDragOverlay = ({
  layers,
}: {
  layers: { id: string; name: string }[];
}) => {
  const { active } = useDndContext();
  const dragLayer = active ? layers.find((l) => l.id === active?.id) : null;
  console.log(dragLayer);

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
