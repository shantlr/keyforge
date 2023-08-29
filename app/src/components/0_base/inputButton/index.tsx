import { ComponentProps, forwardRef, useRef, useState } from 'react';
import { Input } from '../input';
import clsx from 'clsx';
import { InputFit } from '../inputFit';

export const InputButton = forwardRef<
  HTMLDivElement,
  {
    value?: string;
    placeholder?: string;
    active?: boolean;
    edit?: boolean;
    colorScheme?: 'default' | 'text' | 'default-filled';
    onChange?: ComponentProps<typeof Input>['onChange'];
    onVisibilityChange?: (v: boolean) => void;
  } & Omit<ComponentProps<'div'>, 'onChange'>
>(
  (
    {
      active,
      edit,
      value,
      placeholder,
      onClick,
      colorScheme,
      onVisibilityChange,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [showInput, setShowInput] = useState(false);

    if (!edit && !showInput) {
      return (
        <div
          {...(props as any)}
          ref={ref as any}
          className={clsx(
            'h-input-md border-2 border-bg-default rounded px-2 button text-sm cursor-pointer truncate w-full',
            {
              [colorScheme || 'default']: !active,
              primary: active,
            }
          )}
          onClick={(e) => {
            onClick?.(e);
            if (active) {
              setShowInput(true);
              onVisibilityChange?.(true);
            }
          }}
        >
          {value || placeholder}
        </div>
      );
    }
    return (
      <InputFit
        className="w-full"
        // @ts-ignore
        ref={(r) => {
          if (typeof ref === 'function') {
            ref(r);
          } else if (ref) {
            ref.current = r;
          }

          inputRef.current = r;
        }}
        value={value}
        placeholder={placeholder}
        autoFocus
        onBlur={() => {
          setShowInput(false);
          onVisibilityChange?.(false);
        }}
        onKeyUp={(e) => {
          if (e.code === 'Enter' || e.code === 'Escape') {
            inputRef.current?.blur();
          }
        }}
        {...props}
      />
    );
  }
);
InputButton.displayName = 'InputButton';
