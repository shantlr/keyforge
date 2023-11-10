import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { ComponentProps, forwardRef, useRef } from 'react';

export const sizes = {
  md: 'h-input-md',
  lg: 'h-input-lg',
};
export type InputSize = keyof typeof sizes;

export const colorSchemes = {
  default: {
    container:
      'border-slate-300 hover:border-primary-darker focus:border-primary bg-mainbg ',
    input: '',
    clear: '',
  },
  'default-darker': {
    container: 'border-default-darker',
    input: 'placeholder:text-default-darker/80',
    clear: '',
  },
} satisfies Record<
  string,
  {
    container: string;
    input: string;
    clear: string;
  }
>;
export type InputColorScheme = keyof typeof colorSchemes;

export const shapes = {
  default: {
    container: 'rounded px-2 py-1',
    input: '',
  },
  pill: {
    container: 'rounded-xl px-4 py-1',
    input: '',
  },
} satisfies Record<
  string,
  {
    container?: string;
    input?: string;
    clear?: string;
  }
>;
export type InputShape = keyof typeof shapes;

export const Input = forwardRef<
  HTMLInputElement,
  ComponentProps<'input'> & {
    className?: string;
    inputClassName?: string;
    allowClear?: boolean;
    dim?: InputSize;

    colorScheme?: InputColorScheme;
    shape?: InputShape;
    isDisabled?: boolean;
  }
>(
  (
    {
      className,
      inputClassName,
      colorScheme = 'default',
      shape = 'default',
      allowClear,
      dim,
      isDisabled,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
      <span
        className={clsx(
          'text-sm outline-none border transition inline-flex items-center',
          colorSchemes[colorScheme ?? 'default']?.container,
          shapes[shape ?? 'default']?.container,
          sizes[dim!] || sizes.md,
          'group',
          className
        )}
      >
        <input
          className={clsx(
            'bg-transparent outline-none text-sm grow',
            colorSchemes[colorScheme ?? 'default']?.input,
            shapes[shape ?? 'default']?.input,
            sizes[dim!] || sizes.md
          )}
          disabled={isDisabled}
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
            className={clsx(
              'transition hover:text-default-darker opacity-0 group-hover:opacity-100 mx-1',
              colorSchemes[colorScheme ?? 'default']?.clear
            )}
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
  }
);
Input.displayName = 'Input';
