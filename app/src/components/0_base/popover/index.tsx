import { MutableRefObject, useRef } from 'react';
import { DismissButton, Overlay, usePopover } from 'react-aria';
import type { AriaPopoverProps } from 'react-aria';
import type { OverlayTriggerState } from 'react-stately';

interface PopoverProps extends Omit<AriaPopoverProps, 'popoverRef'> {
  children: React.ReactNode;
  state: OverlayTriggerState;
}

export function Popover({
  children,
  state,
  offset = 8,
  popoverRef: forwardPopoverRef,
  ...props
}: PopoverProps & {
  popoverRef?: MutableRefObject<HTMLDivElement | null>;
}) {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const { popoverProps, underlayProps, arrowProps, placement } = usePopover(
    {
      ...props,
      offset,
      popoverRef,
    },
    state
  );

  if (typeof forwardPopoverRef === 'object') {
    forwardPopoverRef.current = popoverRef.current;
  }

  return (
    <Overlay>
      <div {...underlayProps} className="underlay" />
      <div
        {...popoverProps}
        ref={popoverRef}
        className="shadow-md shadow-default-darker popover bg-slate-300 px-1 py-2 text-slate-900 rounded-sm flex flex-col overflow-hidden"
      >
        <DismissButton onDismiss={state.close} />
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
}
