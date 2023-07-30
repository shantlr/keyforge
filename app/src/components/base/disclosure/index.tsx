import clsx from 'clsx';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

export const Disclosure = ({
  defaultOpen = false,
  titleClassName,
  title,
  children,
}: {
  defaultOpen?: boolean;
  titleClassName?: string;
  title: ReactNode;
  children?: ReactNode;
}) => {
  const [show, setShow] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState(0);

  const [style] = useSpring(
    () => ({
      from: { height: 0 },
      to: { height },
    }),
    [height]
  );

  useLayoutEffect(() => {
    if (!show || !contentRef.current) {
      setHeight(0);
      return;
    }
    setHeight(contentRef.current.clientHeight);
  }, [show]);

  return (
    <>
      <button
        className={clsx(
          'w-full px-2 shrink-0 text-mainbg truncate text-start bg-secondary rounded hover:bg-secondary-lighter transition',
          titleClassName,
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

      <animated.div className="overflow-hidden" style={style}>
        <div ref={contentRef}>{children}</div>
      </animated.div>
    </>
  );
};
