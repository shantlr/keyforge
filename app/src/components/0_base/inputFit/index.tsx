import clsx from 'clsx';
import { ComponentProps, forwardRef, useLayoutEffect, useRef } from 'react';

import { Input } from '../input';

export const InputFit = forwardRef<
  HTMLInputElement,
  ComponentProps<typeof Input>
>(({ value, className, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.style.setProperty(
      'min-width',
      `${inputRef.current.parentElement?.clientWidth}px`
    );
  }, []);

  return (
    <Input
      className={clsx(className, 'max-w-full')}
      ref={(r) => {
        inputRef.current = r;
        if (typeof ref === 'function') {
          ref(r);
        } else if (ref) {
          ref.current = r;
        }
      }}
      value={value}
      {...props}
      size={Math.max(value?.toString().length || 4, 4)}
    />
  );
});
InputFit.displayName = 'InputFit';
