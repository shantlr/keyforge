import { Step, Steps } from '../steps';

export const KeyforgeSteps = ({
  current,
  className,
}: {
  current?: 'pick' | 'customize' | 'compile';
  className?: string;
}) => {
  return (
    <Steps current={current} className={className}>
      <Step key="pick" href="/" title="Pick keyboard" />
      <Step key="customize" title="Customize keymap" />
      <Step key="compile" title="Compile firmware" />
    </Steps>
  );
};
