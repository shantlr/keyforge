import { useDraggable } from '@dnd-kit/core';
import {
  JSXElementConstructor,
  ReactElement,
  RefAttributes,
  cloneElement,
  forwardRef,
} from 'react';
import { mergeProps } from 'react-aria';

type Props<Data = any, T extends string | JSXElementConstructor<any> = any> = {
  id: string;
  data: Data;
  disabled?: boolean;
  children:
    | ReactElement<any, T>
    | ((props: { data: Data; isDragging?: boolean }) => ReactElement<any, T>);
};

export const Draggable = forwardRef<any, Props>(
  ({ id, data, disabled, children }, ref) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
      id,
      data,
      disabled,
    });

    const c =
      typeof children === 'function'
        ? children({
            isDragging,
            data,
          })
        : children;

    return cloneElement(c, {
      ...attributes,
      ...mergeProps(c.props, listeners),

      ref: (elem: any) => {
        setNodeRef(elem);

        if ('ref' in c) {
          if (typeof c.ref === 'function') {
            c.ref(elem);
          } else if (c.ref && typeof c.ref === 'object' && 'current' in c.ref) {
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
  }
) as (<Data, Elem extends string | JSXElementConstructor<any>>(
  props: Props<Data, Elem> & RefAttributes<Elem>
) => ReactElement) & {
  displayName: string;
};
Draggable.displayName = 'Draggable';
