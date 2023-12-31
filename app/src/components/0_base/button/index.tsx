'use client';
import clsx from 'clsx';
import { CSSProperties, ForwardedRef, forwardRef, useRef } from 'react';
import { AriaButtonProps, useButton } from 'react-aria';

const SIZE = {
  sm: 'h-input-sm px-1',
  md: 'h-input-md px-4',
};

export const Button = forwardRef(
  (
    {
      className,
      colorScheme,
      size,
      justify = 'center',
      ...props
    }: AriaButtonProps & {
      colorScheme?:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'default'
        | 'text'
        | 'dashed'
        | 'secondary-text';
      size?: keyof typeof SIZE;
      className?: string;
      style?: CSSProperties;
      justify?: 'center' | 'start';
    },
    ref: ForwardedRef<HTMLButtonElement | null>
  ) => {
    const refObj = useRef<HTMLButtonElement | null>(null);
    let { buttonProps } = useButton(props, refObj);
    let { children } = props;

    return (
      <button
        {...buttonProps}
        className={clsx(
          'button rounded-sm outline-none flex items-center',
          {
            'justify-center': justify === 'center',
            'justify-start': justify === 'start',
          },
          SIZE[size || 'md'],
          colorScheme || 'default',
          className
        )}
        ref={(r) => {
          refObj.current = r;
          if (typeof ref === 'function') {
            ref(r);
          } else if (ref && typeof ref === 'object') {
            ref.current = r;
          }
        }}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
