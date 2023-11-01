import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { ComponentProps, forwardRef, useRef } from 'react';

const sizes = {
  md: 'h-input-md',
  lg: 'h-input-lg',
};

export const Input = forwardRef<
  HTMLInputElement,
  ComponentProps<'input'> & {
    className?: string;
    inputClassName?: string;
    allowClear?: boolean;
    dim?: keyof typeof sizes;
  }
>(({ className, inputClassName, allowClear, dim, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <span
      className={clsx(
        'text-sm rounded outline-none border-2 border-slate-300 hover:border-primary-darker focus:border-primary transition bg-mainbg inline-flex items-center',
        sizes[dim!] || sizes.md,
        'group',
        className
      )}
    >
      <input
        className={clsx(
          'bg-transparent outline-none text-sm px-2 py-1 grow',
          sizes[dim!] || sizes.md
        )}
        ref={(r) => {
          inputRef.current = r;
          if (typeof ref === 'function') {
            ref(r);
          } else if (ref && typeof ref === 'object') {
            ref.current = r;
          }
        }}
        {...props}
      />

      {allowClear && (
        <button
          className="transition hover:text-default-darker opacity-0 group-hover:opacity-100 mx-1"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = '';
            }
          }}
        >
          <FontAwesomeIcon icon={faTimesCircle} />
        </button>
      )}
    </span>
  );
});
Input.displayName = 'Input';
