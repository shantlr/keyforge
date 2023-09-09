import { Tooltip } from '@/components/0_base/tooltips';
import { useDraggable } from '@dnd-kit/core';
import clsx from 'clsx';
import { ComponentProps, ReactNode, forwardRef } from 'react';

export type KeyTheme = {
  primary: string;
  secondary: string;
};

export const KEY_THEME: Record<string, KeyTheme> = {
  default: {
    primary: 'bg-slate-400',
    secondary: 'bg-slate-600',
  },
};

export const Key = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    description?: string | null;

    width?: number;
    height?: number;

    isDragging?: boolean;
    onClick?: () => void;
    textSize?: string;
    isDown?: boolean;
    theme?: KeyTheme;
  } & ComponentProps<'div'>
>(
  (
    {
      children,
      className,
      description,
      textSize,
      isDown,
      isDragging,
      style,

      width = 36,
      height = 36,

      theme: {
        primary = KEY_THEME.default.primary,
        secondary = KEY_THEME.default.secondary,
      } = KEY_THEME.default,
      ...props
    },
    ref
  ) => {
    const res = (
      <div
        ref={ref}
        className={clsx(
          'outline-none box-content group select-none cursor-pointer rounded transition-all p-[2px] pb-[8px]',
          {
            'border-dashed pb-[0px] mt-[8px]': isDragging,
            'hover:pb-[6px] active:pb-[2px] hover:mt-[2px] active:mt-[6px]':
              !isDragging,
            'pb-[2px] mt-[2px] mt-[6px]': !isDragging && isDown,
          },
          secondary,
          className
        )}
        style={{
          width,
          height,
          ...(style || null),
        }}
        {...props}
      >
        <div
          className={clsx(
            `text-mainbg whitespace-pre group-hover:${secondary} text-center rounded-sm w-full h-full flex items-center justify-center transition`,
            {
              [secondary]: isDragging,
              [primary]: !isDragging,
            },
            textSize
          )}
        >
          {children}
        </div>
      </div>
    );

    if (description) {
      return (
        <Tooltip
          closeDelay={0}
          tooltip={
            <div className="max-w-[200px] px-2 text-sm whitespace-pre-wrap rounded bg-slate-300/80 text-secondarybg shadow">
              {description}
            </div>
          }
        >
          {res}
        </Tooltip>
      );
    }
    return res;
  }
);
Key.displayName = 'Key';

export const DraggableKey = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof Key> & {
    id: string;
    dragData?: any;
  }
>(({ id, style, className, dragData, ...props }, ref) => {
  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useDraggable({
      id,
      data: dragData,
    });
  const dragStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Key
      ref={(r) => {
        setNodeRef(r);
        if (typeof ref === 'function') {
          ref(r);
        } else if (ref) {
          ref.current = r;
        }
      }}
      className={clsx(className, {
        'z-10': isDragging,
      })}
      {...attributes}
      {...listeners}
      {...props}
      style={{
        ...(style || null),
        ...(dragStyle || null),
      }}
    />
  );
});
DraggableKey.displayName = 'DraggableKey';
