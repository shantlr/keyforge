import clsx from 'clsx';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

export const Disclosure = ({
  defaultOpen = false,
  titleClassName,
  title,
  children,

  show: controlledShow,
  onVisibilityChange,
}: {
  defaultOpen?: boolean;
  titleClassName?: string;
  title: ReactNode;
  children?: ReactNode;

  show?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
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

  const actualShow =
    typeof controlledShow === 'boolean' ? controlledShow : show;

  useLayoutEffect(() => {
    if (!actualShow || !contentRef.current) {
      setHeight(0);
      return;
    }
    setHeight(contentRef.current.clientHeight);

    const obs = new ResizeObserver((changes) => {
      if (changes.length && contentRef.current) {
        setHeight(contentRef.current.clientHeight);
      }
    });
    obs.observe(contentRef.current);
    return () => {
      obs.disconnect();
    };
  }, [actualShow]);

  return (
    <>
      <button
        className={clsx(
          'w-full px-2 shrink-0 text-mainbg truncate text-start bg-default rounded hover:bg-default-lighter transition',
          titleClassName
        )}
        onClick={() => {
          if (typeof controlledShow !== 'boolean') {
            setShow(!actualShow);
          }
          onVisibilityChange?.(!actualShow);
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
