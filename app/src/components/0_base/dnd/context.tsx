import {
  Collision,
  CollisionDetection,
  DndContext as DndContextBase,
  DragEndEvent,
} from '@dnd-kit/core';
import { ComponentProps, createContext, useContext, useState } from 'react';

import { createListenerMapContext } from '../context/listenerMap';

const {
  Provider: ListenersProvider,
  useRegisterEvent,
  useRegisterListener,
} = createListenerMapContext<DragEndEvent>();

const CollisionContext = createContext<Collision[]>([]);

export const useOnDragEnd = useRegisterListener;

export type WrappedCollisionDetection = (
  param: Parameters<CollisionDetection>[0] & {
    prevCollisions: Collision[];
  }
) => ReturnType<CollisionDetection>;

const DndContextInner = ({
  onDragEnd,
  onDragOver,
  children,
  collisionDetection,
  ...props
}: Omit<ComponentProps<typeof DndContextBase>, 'collisionDetection'> & {
  collisionDetection: WrappedCollisionDetection;
}) => {
  const registerEvent = useRegisterEvent();
  const [collisions, setCollisions] = useState<Collision[]>([]);

  return (
    <DndContextBase
      collisionDetection={
        collisionDetection
          ? (e) => {
              return collisionDetection?.({
                ...e,
                prevCollisions: collisions,
              });
            }
          : undefined
      }
      onDragOver={(event) => {
        setCollisions(event.collisions ?? []);
        onDragOver?.(event);
      }}
      onDragEnd={(e) => {
        if (e.over) {
          registerEvent(e.over.id as string, e);
        }

        setCollisions([]);

        if (typeof onDragEnd === 'function') {
          onDragEnd(e);
        }
      }}
      {...props}
    >
      <CollisionContext.Provider value={collisions}>
        {children}
      </CollisionContext.Provider>
    </DndContextBase>
  );
};

export const useDndCollisions = () => useContext(CollisionContext);

export const DndContext = (props: ComponentProps<typeof DndContextInner>) => {
  return (
    <ListenersProvider>
      <DndContextInner {...props} />
    </ListenersProvider>
  );
};

export const useOnDrop = (
  droppableId: string | null,
  cb: Parameters<typeof useRegisterListener>[1]
) => {
  useRegisterListener(droppableId, cb);
};
