'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import { ReactNode, useMemo } from 'react';

import { Button } from '@/components/0_base/button';

const Item = ({
  href,
  active,
  disabled,
  children,
}: {
  href?: string;
  active?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}) => {
  const button = (
    <Button
      className={clsx('rounded-xl transition-all', {
        'min-w-[320px]': active,
        'text-xs min-w-[120px]': !active,
      })}
      colorScheme={active ? 'primary' : 'default'}
      isDisabled={disabled}
    >
      {children}
    </Button>
  );
  if (href) {
    return <Link href={href}>{button}</Link>;
  }
  return button;
};

export const HeaderSteps = () => {
  const seg = useSelectedLayoutSegments();

  const active = useMemo(() => {
    if (seg.length === 0) {
      return 'pick';
    }
    if (seg.length === 1) {
      return 'customize';
    }
    return 'compile';
  }, [seg.length]);

  return (
    <div
      className="flex items-center justify-center py-8 space-x-2 mb-4"
      data-blur-key-down
    >
      <Item href="/" active={active === 'pick'}>
        Pick a keyboard
      </Item>
      <Item
        href={seg.length >= 1 ? `/${seg[0]}` : undefined}
        disabled={active === 'pick'}
        active={active === 'customize'}
      >
        Customize
      </Item>
      <Item
        href={seg.length >= 1 ? `/${seg[0]}/compile` : undefined}
        disabled={active === 'pick'}
        active={active === 'compile'}
      >
        Compile firmware
      </Item>
    </div>
  );
};
