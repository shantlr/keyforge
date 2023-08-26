import {
  ComponentElement,
  ComponentProps,
  ReactNode,
  cloneElement,
  forwardRef,
  useCallback,
  useRef,
} from 'react';
import {
  AriaPopoverProps,
  Overlay,
  mergeProps,
  useHover,
  usePopover,
} from 'react-aria';
import {
  OverlayTriggerState,
  TooltipTriggerProps,
  useTooltipTriggerState,
} from 'react-stately';

const TooltipPopover = ({
  children,
  state,
  offset = 8,
  onPointerEnter,
  onPointerLeave,
  ...props
}: {
  state: OverlayTriggerState;
  children: ReactNode;
} & Omit<AriaPopoverProps, 'popoverRef'> &
  ComponentProps<'div'>) => {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const { popoverProps, underlayProps } = usePopover(
    {
      ...props,
      offset,
      popoverRef,
    },
    state
  );

  return (
    <Overlay>
      <div {...underlayProps} className="underlay" />
      <div
        {...popoverProps}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        ref={popoverRef}
      >
        {children}
      </div>
    </Overlay>
  );
};

const useTooltipStateAsOverlayState = (props: TooltipTriggerProps) => {
  const { isOpen, open, close } = useTooltipTriggerState(props);
  return {
    isOpen,
    open,
    close,
    setOpen: useCallback(
      (value: boolean) => {
        if (value) {
          open();
        } else {
          close();
        }
      },
      [close, open]
    ),
    toggle: useCallback(() => {
      if (isOpen) {
        close();
      } else {
        open();
      }
    }, [open, close, isOpen]),
  };
};

export const Tooltip = forwardRef<
  HTMLDivElement,
  {
    children: ComponentElement<any, any>;
    tooltip?: ReactNode;
  } & TooltipTriggerProps &
    Pick<AriaPopoverProps, 'placement'>
>(
  (
    {
      children,
      tooltip,
      delay,
      closeDelay,
      defaultOpen,
      isDisabled,
      isOpen,
      onOpenChange,
      trigger,
      placement,
      ...props
    },
    r
  ) => {
    const state = useTooltipStateAsOverlayState({
      delay,
      closeDelay,
      defaultOpen,
      isDisabled,
      isOpen,
      onOpenChange,
      trigger,
    });
    const ref = useRef<Element | null>(null);

    const { hoverProps: childrenHoverProps, isHovered: isChildrenHovered } =
      useHover({
        onHoverChange: (c) => state.setOpen(c || isOverlayHovered),
      });
    const { hoverProps: overlayHoverProps, isHovered: isOverlayHovered } =
      useHover({
        onHoverChange: (c) => state.setOpen(c || isChildrenHovered),
      });

    return (
      <div ref={r} {...mergeProps(props, childrenHoverProps)}>
        {cloneElement(children, {
          ...children.props,
          ref: (r: Element) => {
            ref.current = r;

            if (typeof children.ref === 'function') {
              children.ref(r);
            } else if (
              children.ref &&
              typeof children.ref === 'object' &&
              'current' in children.ref
            ) {
              // @ts-ignore
              children.ref.current = r;
            }
          },
        })}
        {state.isOpen && (
          <TooltipPopover
            state={state}
            triggerRef={ref}
            isNonModal
            placement={placement}
            {...overlayHoverProps}
          >
            {tooltip}
          </TooltipPopover>
        )}
      </div>
    );
  }
);
Tooltip.displayName = 'Tooltip';
