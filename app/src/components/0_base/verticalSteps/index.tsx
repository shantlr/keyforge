import {
  faCheck,
  faHourglass,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { isArray } from 'lodash';
import { Fragment, ReactElement, ReactNode, isValidElement } from 'react';

import { Spinner } from '../spinner';

export const Step = ({}: {
  name: string;
  failed?: boolean;
  done?: boolean;
  doneIcon?: ReactNode;
  pendingIcon?: ReactNode;
  loadingIcon?: ReactNode;
  children: (arg: { active?: boolean }) => ReactNode;
}) => {
  return null;
};

const StepState = ({
  className,
  state,
  doneIcon,
  pendingIcon,
  loadingIcon,
}: {
  className?: string;
  doneIcon?: ReactNode;
  pendingIcon?: ReactNode;
  loadingIcon?: ReactNode;
  state: 'failed' | 'loading' | 'pending' | 'done';
}) => {
  return (
    <div
      className={clsx(
        'w-[36px] h-[36px] rounded-xl flex items-center justify-center border',
        {
          'border-primary': state === 'loading',
          'border-success': state === 'done',
          'border-default': state === 'pending',
          'border-danger': state === 'failed',
        },
        className
      )}
    >
      {state === 'failed' && (
        <FontAwesomeIcon className="text-danger" icon={faXmark} />
      )}
      {state === 'loading' &&
        (loadingIcon || <Spinner className="text-primary" />)}
      {state === 'pending' &&
        (pendingIcon || (
          <FontAwesomeIcon className="text-default" icon={faHourglass} />
        ))}
      {state === 'done' &&
        (doneIcon || (
          <FontAwesomeIcon className="text-success" icon={faCheck} />
        ))}
    </div>
  );
};

export const VerticalSteps = ({
  current,
  children,
}: {
  current?: string;
  children: ReactNode;
}) => {
  const steps: ReactNode[] = [];

  const renderStep = (c: any, last?: boolean) => {
    if (!isValidElement(c)) {
      return;
    }
    const props = c.props as any;
    if (
      typeof props.name === 'string' &&
      typeof props.children === 'function'
    ) {
    }
    const elem = props.children({
      active: props.name === current,
    });
    if (typeof elem === 'string' || isValidElement(elem)) {
      const done = Boolean(props.done);
      const failed = Boolean(props.failed);

      steps.push(
        <div className="flex" key={props.name}>
          <div className="flex flex-col">
            <StepState
              state={
                failed
                  ? 'failed'
                  : done
                  ? 'done'
                  : current === props.name
                  ? 'loading'
                  : 'pending'
              }
              loadingIcon={props.loadingIcon}
              pendingIcon={props.pendingIcon}
              doneIcon={props.doneIcon}
              className="mr-2 shrink-0"
            />
            {!last && (
              <div className="ml-[17px] w-[2px] min-h-[25px] h-full bg-default transition"></div>
            )}
          </div>
          <div className="w-full p-2">{elem}</div>
        </div>
      );
    }
  };

  if (isArray(children)) {
    children.forEach((c, idx) => renderStep(c, idx === children.length - 1));
  } else {
    renderStep(children, true);
  }

  return <div className="">{steps}</div>;
};
