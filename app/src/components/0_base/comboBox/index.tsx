import { Popper } from '@mui/base';
import { useAutocomplete } from '@mui/base/useAutocomplete';
import clsx from 'clsx';
import { KeyboardEventHandler, ReactNode, SyntheticEvent } from 'react';

import { Input, InputColorScheme, InputShape, InputSize } from '../input';

export function Combobox<T>({
  className,

  colorScheme,
  shape,
  dim,

  input,
  inputClassName,
  placeholder,
  onInputChange,
  onInputChangeEvent,
  onInputKeyUp,

  options,
  value,
  onSelect,

  getOptionKey,
  renderOption,
}: {
  input?: string;
  placeholder?: string;
  className?: string;
  dim?: InputSize;
  inputClassName?: string;
  colorScheme?: InputColorScheme;
  shape?: InputShape;
  onInputChange?: (value: string) => void;
  onInputChangeEvent?: (e: SyntheticEvent) => void;
  onInputKeyUp?: KeyboardEventHandler<HTMLInputElement>;

  options: T[];
  value?: T | null;
  onSelect?: (v: T | null) => void;

  getOptionKey?: (option: T) => string;
  renderOption?: (option: T) => ReactNode;
}) {
  const {
    getRootProps,
    getInputProps,
    getOptionProps,
    groupedOptions,
    getListboxProps,
    anchorEl,
    setAnchorEl,
    popupOpen,
  } = useAutocomplete({
    value,
    includeInputInList: true,

    inputValue: input,
    onInputChange: (e, v) => {
      onInputChangeEvent?.(e);
      onInputChange?.(v);
    },
    onChange: (e, v) => {
      onSelect?.(v);
    },
    filterOptions: (opts) => opts,
    options,
    getOptionLabel: getOptionKey,
  });

  return (
    <>
      <div className={className} {...getRootProps()} ref={setAnchorEl}>
        <Input
          className={clsx('w-full', inputClassName)}
          colorScheme={colorScheme}
          shape={shape}
          dim={dim}
          placeholder={placeholder}
          {...getInputProps()}
          onKeyUp={onInputKeyUp}
        />
      </div>
      {anchorEl && (
        <Popper
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 10],
              },
            },
          ]}
          open={popupOpen}
          placement="auto"
          anchorEl={anchorEl}
        >
          <ul
            {...getListboxProps()}
            className="max-w-[300px] bg-slate-300 py-2 rounded max-h-[500px] overflow-auto shadow-lg shadow-slate-800"
          >
            {(groupedOptions as T[]).map((opt, index) => (
              <li
                {...getOptionProps({ option: opt, index })}
                key={getOptionKey?.(opt) ?? index}
                className="mx-2 hover:bg-primary hover:text-white cursor-pointer px-2 rounded transition-all"
              >
                {renderOption?.(opt) ??
                  (typeof opt === 'string' || typeof opt === 'number'
                    ? opt
                    : null)}
              </li>
            ))}
          </ul>
        </Popper>
      )}
    </>
  );
}
