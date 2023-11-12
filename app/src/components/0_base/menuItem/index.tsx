import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { motion, useAnimate } from 'framer-motion';
import { ReactNode, useEffect, useRef, useState } from 'react';

export const MenuItem = ({
  content,
  children,
}: {
  content: ReactNode;
  children: ReactNode;
}) => {
  const [expand, setExpand] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const [scope, animate] = useAnimate();
  const contentRef = useRef<HTMLDivElement | null>(null);

  const runExpandAnimation = async () => {
    animate(
      '& > #icon',
      {
        opacity: 0,
      },
      {
        duration: 0.1,
      }
    );
    animate(
      '& > #icon',
      {
        display: 'none',
      },
      {
        duration: 0,
      }
    );
    await animate(
      scope.current,
      {
        opacity: 1,
      },
      {
        duration: 0,
      }
    );
    await animate(scope.current, {
      scale: 0.8,
    });
    await animate(scope.current, {
      scale: 1,
      borderStyle: 'solid',
    });
    await animate(
      '&>#content',
      {
        display: 'block',
      },
      {
        duration: 0.5,
      }
    );
    console.log(scope.current.querySelector('&>#content').clientHeight);
    await animate(scope.current, {
      width: 300,
    });
    await animate(scope.current, {
      height: 'fit-content',
    });
    await animate('&>#content', {
      opacity: 1,
    });
    // await animate(scope.current, {
    //   borderStyle: 'solid',
    // });
  };
  const runCloseAnimation = async () => {
    await animate('&>#content', { opacity: 0 });
    animate('&>#content', { display: 'none' });
    await animate(scope.current, { height: 30, borderStyle: 'dashed' });
    await animate(scope.current, { width: 30 });
    await animate('& > #icon', {
      opacity: 1,
      display: 'flex',
    });
  };
  useEffect(() => {
    if (!expand) {
      return;
    }

    runExpandAnimation();
    return () => {
      runCloseAnimation();
    };
  }, [expand]);

  return (
    <div ref={setContainer} className="relative">
      <div
        style={{
          width: 30,
          height: 30,
        }}
      />
      <BasePopup
        offset={{
          mainAxis: -30,
        }}
        open
        placement="bottom-start"
        anchor={container}
      >
        <motion.div
          ref={scope}
          style={{ width: 30, height: 30 }}
          className="relative bg-mainbg transition-[border-style] hover:border-default rounded border border-dashed border-default-darker cursor-pointer"
          onClick={(e) => {
            if (!expand) {
              setExpand(true);
            }
          }}
        >
          <div
            id="icon"
            style={{ width: 30, height: 30 }}
            className="absolute top-[-1px] left-[-1px] flex justify-center items-center rounded"
          >
            {children}
          </div>
          <div
            id="content"
            ref={contentRef}
            className="h-full hidden p-2 space-y-2 opacity-0 shadow-lg shadow-default-darker"
            onClick={(e) => {
              if (expand && e.target === contentRef.current) {
                setExpand(false);
              }
            }}
          >
            {content}
          </div>
        </motion.div>
      </BasePopup>
    </div>
  );
};
