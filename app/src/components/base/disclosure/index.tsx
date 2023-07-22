import clsx from 'clsx';
import { ReactNode, useState } from 'react';

export const Disclosure = ({
  className,
  defaultOpen = false,
  containerClassName,
  title,
  children,
}: {
  defaultOpen?: boolean;
  className?: string;
  containerClassName?: string;
  title: ReactNode;
  children?: ReactNode;
}) => {
  const [show, setShow] = useState(defaultOpen);
  return (
    <div className={className}>
      <button
        className={clsx(
          'w-full px-2 shrink-0 text-mainbg truncate text-start bg-secondary rounded hover:bg-secondary-lighter transition',
          {
            'mb-2': show,
          }
        )}
        onClick={() => {
          setShow(!show);
        }}
      >
        {title}
      </button>

      <div className={clsx('px-4', containerClassName)}>
        {Boolean(show) && children}
      </div>
    </div>
  );
};
