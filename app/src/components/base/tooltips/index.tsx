import { ReactElement, ReactNode, cloneElement, useRef } from 'react';
import { AriaTooltipProps, useTooltip, useTooltipTrigger } from 'react-aria';
import {
  TooltipTriggerProps,
  TooltipTriggerState,
  useTooltipTriggerState,
} from 'react-stately';

const TooltipPopover = ({
  children,
  state,
  ...props
}: { state?: TooltipTriggerState; children: ReactNode } & AriaTooltipProps) => {
  const { tooltipProps } = useTooltip(props, state);
  return (
    <div className="absolute top-0 right-[-26px] z-100" {...tooltipProps}>
      {children}
    </div>
  );
};

export const Tooltip = ({
  children,
  tooltip,
  disableHideOnClick,
  ...props
}: {
  children: ReactElement;
  tooltip?: ReactNode;
  disableHideOnClick?: boolean;
} & TooltipTriggerProps) => {
  const state = useTooltipTriggerState(props);
  let ref = useRef(null);

  const { triggerProps, tooltipProps } = useTooltipTrigger(props, state, ref);

  return (
    <div className="relative">
      {cloneElement(children, {
        ...children.props,
        ...triggerProps,
        onClick: (e: any) => {
          children.props.onClick?.(e);
          if (!disableHideOnClick) {
            triggerProps.onClick?.(e);
          }
        },
      })}
      {state.isOpen && (
        <TooltipPopover {...tooltipProps} state={state}>
          {tooltip}
        </TooltipPopover>
      )}
      <div />
    </div>
  );
};
