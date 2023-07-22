import clsx from 'clsx';
import { ComponentProps, forwardRef } from 'react';

export const Input = forwardRef<
  HTMLInputElement,
  ComponentProps<'input'> & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <input
      className={clsx(
        'rounded outline-none border-2 border-slate-300 hover:border-primary-darker focus:border-primary transition bg-mainbg px-2 py-1',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';
