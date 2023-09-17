import { useDroppable } from '@dnd-kit/core';
import { ReactElement, cloneElement, forwardRef, useMemo } from 'react';
import { useOnDrop } from '../dnd/context';

export const Droppable = forwardRef<
  any,
  {
    id: string;
    data: any;
    onDrop?: Parameters<typeof useOnDrop>[1];
    children: ReactElement | ((props: { isOver?: boolean }) => ReactElement);
  }
>(({ id, data, onDrop, children }, ref) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data,
  });

  useOnDrop(id, onDrop);

  return useMemo(() => {
    const c = typeof children === 'function' ? children({ isOver }) : children;

    return cloneElement(c, {
      ...c.props,
      ref: (elem: any) => {
        setNodeRef(elem);
        if ('ref' in c) {
          if (typeof c.ref === 'function') {
            c.ref(elem);
          } else if (typeof c.ref === 'object' && c.ref && 'current' in c.ref) {
            c.ref.current = elem;
          }
        }

        if (typeof ref === 'function') {
          ref(elem);
        } else if (ref) {
          ref.current = elem;
        }
      },
    });
  }, [children, isOver, ref, setNodeRef]);
});
Droppable.displayName = 'Droppable';
