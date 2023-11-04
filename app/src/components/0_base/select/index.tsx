'use client';

import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MutableRefObject, useRef } from 'react';
import { AriaSelectProps, HiddenSelect, useSelect } from 'react-aria';
import { useSelectState } from 'react-stately';

import { Button } from '../button';
import { ListBox } from '../listBox';
import { Popover } from '../popover';

type Props<T> = AriaSelectProps<T> & {
  className?: string;
  inputClassName?: string;
  colorScheme: any;
  size?: any;
  buttonRef?:
    | MutableRefObject<HTMLButtonElement | null>
    | ((elem: HTMLButtonElement | null) => void);
};

export function Select<T extends object>({
  className,
  colorScheme,
  inputClassName,
  size,
  buttonRef: propsButtonRef,
  ...props
}: Props<T>) {
  const state = useSelectState(props);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { labelProps, triggerProps, valueProps, menuProps } = useSelect(
    props,
    state,
    buttonRef
  );

  return (
    <div className={className} style={{ display: 'inline-block' }}>
      <div {...labelProps}>{props.label}</div>
      <HiddenSelect
        isDisabled={props.isDisabled}
        state={state}
        triggerRef={buttonRef}
        label={props.label}
        name={props.name}
      />
      <Button
        colorScheme={colorScheme}
        className={inputClassName}
        size={size}
        {...triggerProps}
        ref={(elem) => {
          buttonRef.current = elem;
          if (typeof propsButtonRef === 'function') {
            propsButtonRef(elem);
          } else if (propsButtonRef) {
            propsButtonRef.current = elem;
          }
        }}
        style={{ height: 30, fontSize: 14 }}
      >
        <span {...valueProps}>
          {state.selectedItem
            ? state.selectedItem.rendered
            : 'Select an option'}
        </span>
        <span aria-hidden="true" style={{ paddingLeft: 5 }}>
          <FontAwesomeIcon icon={faCaretDown} />
        </span>
      </Button>
      {state.isOpen && (
        <Popover state={state} triggerRef={buttonRef} placement="bottom start">
          <ListBox {...menuProps} state={state}></ListBox>
        </Popover>
      )}
    </div>
  );
}
