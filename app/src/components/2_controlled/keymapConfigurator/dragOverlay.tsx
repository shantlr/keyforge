import { QMKKey } from '@/components/1_domain/qmkKey';
import { DragOverlay, useDndContext } from '@dnd-kit/core';

export const ConfiguratorDraggableOverlay = () => {
  const { active } = useDndContext();

  return (
    <DragOverlay>
      {active?.data.current ? (
        <QMKKey
          width={active.data.current.width}
          height={active.data.current.height}
          keyDef={active.data.current.kDef}
          textSize={active.data.current.textSize}
        />
      ) : null}
    </DragOverlay>
  );
};
