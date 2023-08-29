import { useDraggable } from '@dnd-kit/core';
import { ReactElement, cloneElement } from 'react';
import { mergeProps } from 'react-aria';

export const Draggable = ({
  id,
  data,
  children,
  isDraggingAs,
}: {
  id: string;
  data: any;
  children: ReactElement;
  isDraggingAs?: string;
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data,
  });

  return cloneElement(children, {
    ...attributes,
    ...mergeProps(children.props, listeners),

    [isDraggingAs || 'isDragging']: isDragging,

    ref: (elem: any) => {
      setNodeRef(elem);
      if (typeof children.props.ref === 'function') {
        children.props.ref(elem);
      } else if (children.props.ref) {
        children.props.ref.current = elem;
      }
    },
  });
};
