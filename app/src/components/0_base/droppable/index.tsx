import { useDroppable } from '@dnd-kit/core';
import { ReactElement, cloneElement, forwardRef } from 'react';

export const Droppable = forwardRef<
  any,
  {
    id: string;
    data: any;
    children: ReactElement | ((props: { isOver?: boolean }) => ReactElement);
  }
>(({ id, data, children }, ref) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data,
  });
  if (isOver) {
    console.log(isOver);
  }

  const c = typeof children === 'function' ? children({ isOver }) : children;

  return cloneElement(c, {
    ref: (elem: any) => {
      setNodeRef(elem);
      if (typeof c.props.ref === 'function') {
        c.props.ref(elem);
      } else if (c.props.ref) {
        c.props.ref.current = elem;
      }

      if (typeof ref === 'function') {
        ref(elem);
      } else if (ref) {
        ref.current = elem;
      }
    },
  });
});
Droppable.displayName = 'Droppable';
