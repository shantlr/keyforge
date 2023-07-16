import { ComponentProps, forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement>(
  (props: ComponentProps<'input'>, ref) => {
    return (
      <input
        className="rounded outline-none border-2 border-slate-300 hover:border-primary-darker focus:border-primary transition bg-mainbg px-2 py-1"
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
