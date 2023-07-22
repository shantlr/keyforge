import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode, useMemo, isValidElement, ComponentProps } from 'react';

export const Step = (props: { title: ReactNode; href?: string }) => {
  return null;
};

type MappedStep = ComponentProps<typeof Step> & { key: string | number };

export const Steps = ({
  current,
  children,
  className,
}: {
  current?: string | number;
  children: ReactNode;
  className?: string;
}) => {
  const steps = useMemo((): MappedStep[] => {
    if (Array.isArray(children)) {
      const res: MappedStep[] = [];
      children.forEach((c, idx) => {
        if (isValidElement(c) && c.type === Step) {
          if (c.type === Step) {
            res.push({
              ...(c.props as any),
              key: c.key || idx,
            });
          }
        }
      });
      return res;
    } else if (isValidElement(children) && children.type === Step) {
      return [
        {
          ...children.props,
          key: children.key || undefined,
        },
      ];
    }
    return [];
  }, [children]);

  const currentIdx = useMemo(() => {
    return steps.findIndex((s) => s.key === current);
  }, [current, steps]);

  return (
    <div className={clsx('flex items-center', className)}>
      {steps.map((s, index) => {
        let elem = (
          <div
            key={s.key}
            className={clsx('transition', {
              'text-primary': index === currentIdx,
              'text-slate-700': index > currentIdx,
              'text-sm': index !== currentIdx,
            })}
          >
            {s.title}
          </div>
        );
        if (s.href && index < currentIdx) {
          elem = <Link href={s.href}>{elem}</Link>;
        }

        return (
          <>
            {elem}
            {index < steps.length - 1 && (
              <div className="mx-8 w-[50px] border-b-2" />
            )}
          </>
        );
      })}
    </div>
  );
};
