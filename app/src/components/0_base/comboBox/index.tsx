import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';
import { AriaComboBoxProps, useComboBox, useFilter } from 'react-aria';
import { useComboBoxState } from 'react-stately';

import { Button } from '../button';
import { Input } from '../input';
import { ListBox } from '../listBox';
import { Popover } from '../popover';


export function ComboBox<Option extends object>({
  className,
  ...props
}: AriaComboBoxProps<Option> & {
  className?: string;
}) {
  // Setup filter function and state.
  let { contains } = useFilter({ sensitivity: 'base' });
  let state = useComboBoxState<Option>({ ...props, defaultFilter: contains });

  // Setup refs and get props for child elements.
  let buttonRef = useRef(null);
  let inputRef = useRef(null);
  let listBoxRef = useRef(null);
  let popoverRef = useRef(null);

  let { buttonProps, inputProps, listBoxProps, labelProps } = useComboBox(
    {
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef,
    },
    state
  );

  return (
    <div
      style={{ display: 'inline-flex', flexDirection: 'column' }}
      className={className}
    >
      <label {...labelProps}>{props.label}</label>
      <div>
        <div className="group h-input-md overflow-hidden flex">
          <Input {...inputProps} ref={inputRef} className="rounded-r-none" />
          <Button className="rounded-l-none" {...buttonProps} ref={buttonRef}>
            <FontAwesomeIcon icon={faCaretDown} />
          </Button>
        </div>

        {state.isOpen && (
          <Popover
            state={state}
            triggerRef={inputRef}
            popoverRef={popoverRef}
            isNonModal
            placement="bottom start"
          >
            <ListBox {...listBoxProps} listBoxRef={listBoxRef} state={state} />
          </Popover>
        )}
      </div>
    </div>
  );
}
