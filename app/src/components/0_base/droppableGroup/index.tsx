import { useCallback, useMemo, useRef } from 'react';
import { useDndCollisions } from '../dnd/context';

export const useDroppableContainer = () => {
  const collisions = useDndCollisions();
  const nodeRef = useRef<HTMLElement | null>(null);

  const isOver = useMemo(() => {
    if (!nodeRef.current || !collisions?.length) {
      return false;
    }

    return collisions.some((c) => {
      const node = c.data?.droppableContainer?.node?.current as
        | HTMLElement
        | undefined;
      if (!node) {
        return false;
      }
      return nodeRef.current?.contains(node);
    });
  }, [collisions]);

  return {
    isOver,
    setNodeRef: useCallback((e: HTMLElement | null) => {
      nodeRef.current = e;
    }, []),
  };
};
