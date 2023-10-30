import { useSpring, animated } from '@react-spring/web';
import clsx from 'clsx';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';

export const Disclosure = ({
  defaultOpen = false,
  titleClassName,
  title,

  contentClassName,
  children,

  show: controlledShow,
  onVisibilityChange,
}: {
  defaultOpen?: boolean;
  titleClassName?: string;
  title: ReactNode;
  contentClassName?: string;
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
      <div className="border border-gray-700 rounded overflow-hidden">
        <button
          className={clsx(
            'w-full px-2 shrink-0 rounded-none border-b border-gray-800 truncate text-start hover:bg-secondarybg-lighter transition',
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

        <animated.div className={clsx('overflow-hidden')} style={style}>
          <div className={contentClassName} ref={contentRef}>
            {children}
          </div>
        </animated.div>
      </div>
    </>
  );
};
