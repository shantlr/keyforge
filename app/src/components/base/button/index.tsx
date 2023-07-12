import clsx from 'clsx';
import { CSSProperties, ForwardedRef, forwardRef, useRef } from 'react';
import { AriaButtonProps, useButton } from 'react-aria';

export const Button = forwardRef(
  (
    {
      className,
      ...props
    }: AriaButtonProps & {
      className?: string;
      style?: CSSProperties;
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
          'px-4 rounded-sm bg-amber-300 text-slate-900 outline-none',
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
