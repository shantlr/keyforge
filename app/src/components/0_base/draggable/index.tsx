import { useDraggable } from '@dnd-kit/core';
import { ReactElement, cloneElement, forwardRef } from 'react';
import { mergeProps } from 'react-aria';

export const Draggable = forwardRef<
  any,
  {
    id: string;
    data: any;
    children:
      | ReactElement
      | ((props: { isDragging?: boolean }) => ReactElement);
  }
>(({ id, data, children }, ref) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data,
  });

  const c =
    typeof children === 'function'
      ? children({
          isDragging,
        })
      : children;

  return cloneElement(c, {
    ...attributes,
    ...mergeProps(c.props, listeners),

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
Draggable.displayName = 'Draggable';
