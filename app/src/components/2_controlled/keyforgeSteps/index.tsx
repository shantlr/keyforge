import Link from 'next/link';
import { Step, Steps } from '../../0_base/steps';
import { ReactNode } from 'react';

export const KeyforgeSteps = ({
  current,
  className,
  customize,
  compile,
}: {
  current?: 'pick' | 'customize' | 'compile';
  className?: string;
  customize?: ReactNode;
  compile?: ReactNode;
}) => {
  return (
    <Steps current={current} className={className}>
      <Step
        key="pick"
        href="/"
        title={
          <Link className="hover:text-primary-lighter transition" href="/">
            Pick Keyboard
          </Link>
        }
      />
      <Step key="customize" title={customize || 'Customize keymap'} />
      <Step key="compile" title={compile || 'Compile firmware'} />
    </Steps>
  );
};
