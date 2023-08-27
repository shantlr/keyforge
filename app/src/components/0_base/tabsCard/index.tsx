import clsx from 'clsx';
import { flatMap } from 'lodash';
import {
  ReactElement,
  ReactNode,
  isValidElement,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const Tab = ({}: { title?: ReactNode; children: ReactNode }) => {
  return null;
};

const mapChildrenToTab = (
  c: ReactNode
): {
  key: string;
  title?: ReactElement;
  elem: ReactElement;
}[] => {
  if (isValidElement(c)) {
    if ('children' in c.props && isValidElement(c.props.children)) {
      const key = c.key || c.props.title;
      if (typeof key === 'string' || typeof key === 'number') {
        return [
          {
            key: key.toString(),
            title:
              isValidElement(c.props.title) ||
              typeof c.props.title === 'string' ||
              typeof c.props.title === 'number'
                ? c.props.title
                : null,
            elem: c.props.children,
          },
        ];
      }
    }
  }

  if (Array.isArray(c)) {
    return flatMap(c.map(mapChildrenToTab));
  }

  return [];
};

export const TabsCard = ({
  className,
  contentClassName,
  children,
}: {
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}) => {
  const tabs = useMemo(() => {
    return mapChildrenToTab(children);
  }, [children]);

  const [currenTabKey, setCurrentTab] = useState<string | null>(null);

  useEffect(() => {
    if (!tabs.length) {
      setCurrentTab(null);
    }
    if (!tabs.some((t) => t.key === currenTabKey)) {
      setCurrentTab(tabs[0]?.key || null);
    }
  }, [currenTabKey, tabs]);

  const { currentTabIdx, currentTab } = useMemo(() => {
    const idx = tabs.findIndex((t) => t.key === currenTabKey);
    return {
      currentTabIdx: idx,
      currentTab: tabs[idx],
    };
  }, [currenTabKey, tabs]);

  return (
    <div className={clsx('w-full h-full rounded overflow-hidden', className)}>
      {/* header */}
      <div className="bg-mainbg flex">
        {tabs.map((t) => (
          <div
            className={clsx(
              'px-4 rounded-t hover:bg-secondarybg-lighter cursor-pointer transition',
              {
                'bg-secondarybg text-primary': currenTabKey === t.key,
                'bg-mainbg': currenTabKey !== t.key,
              }
            )}
            key={t.key}
            onClick={() => {
              setCurrentTab(t.key);
            }}
          >
            {t.title}
          </div>
        ))}
      </div>
      {/* content */}
      <div
        className={clsx(
          'rounded-t overflow-hidden text-default bg-secondarybg h-full w-full',
          {
            'rounded-tl-none': currentTabIdx === 0,
          },
          contentClassName
        )}
      >
        {currentTab?.elem}
      </div>
    </div>
  );
};
