import clsx from 'clsx';
import { ComponentProps, ReactNode, forwardRef } from 'react';

import { Tooltip } from '@/components/0_base/tooltips';

export type KeyTheme = {
  primary: string;
  secondary: string;
  down?: {
    primary: string;
    secondary: string;
  };
};

export const KEY_THEME: Record<string, KeyTheme> = {
  default: {
    primary: 'bg-slate-400',
    secondary: 'bg-slate-600',

    down: {
      primary: 'bg-yellow-400',
      secondary: 'bg-yellow-600',
    },
  },
};

export const KEY_DEFAULT_WIDTH = 36;
export const KEY_DEFAULT_HEIGHT = 36;

export const Key = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    description?: string | null;

    width?: number;
    height?: number;

    isDragging?: boolean;
    onClick?: (e: MouseEvent) => void;
    textSize?: string;
    isDown?: boolean;
    theme?: KeyTheme;
    zIndex?: number;
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

      width = KEY_DEFAULT_WIDTH,
      height = KEY_DEFAULT_HEIGHT,

      theme = KEY_THEME.default,
      zIndex,
      ...props
    },
    ref
  ) => {
    const res = (
      <div
        ref={ref}
        className={clsx(
          'outline-none box-content group select-none cursor-pointer rounded transition-all p-[2px] pb-[8px] active:before:animate-[ripples]',
          {
            'border-dashed pb-[0px] mt-[8px]': isDragging,
            'hover:pb-[6px] active:pb-[2px] hover:mt-[2px] active:mt-[6px]':
              !isDragging,
            'pb-[2px] mt-[2px] mt-[6px]': !isDragging && isDown,

            'before:w-full before:h-full before:box-content before:outline-yellow-700 before:rounded before:top-0 before:left-0 before:absolute before:animate-[ripples_0.8s_ease-in]':
              isDown,

            [`${theme.down?.secondary || theme.secondary}`]: isDown,
            [`${theme.secondary}`]: !isDown,
          },
          className
        )}
        style={{
          width,
          height,
          zIndex,
          ...(style || null),
        }}
        {...props}
      >
        <div
          className={clsx(
            `text-mainbg whitespace-pre text-center rounded-sm w-full h-full flex items-center justify-center transition`,
            {
              [`${theme.down?.primary || theme.primary}`]:
                isDown && !isDragging,
              [`${theme.primary}`]: !isDown && !isDragging,
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
