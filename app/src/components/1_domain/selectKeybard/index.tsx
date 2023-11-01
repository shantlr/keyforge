'use client';

import clsx from 'clsx';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';

import { Input } from '@/components/0_base/input';

export const SelectKeyboard = ({
  value,
  className,
  keyboards,
  onKeyboardHover,
}: {
  value?: string | null;
  className?: string;
  keyboards: { name: string; key: string; qmkpath: string }[];
  onKeyboardHover?: (kb: {
    name: string;
    key: string;
    qmkpath: string;
  }) => void;
}) => {
  const [search, setSearch] = useState('');

  const deferredSearch = useDeferredValue(search);

  const [fuse] = useState(
    () =>
      new Fuse(keyboards, {
        keys: ['key'],
      })
  );

  const results = useMemo(() => {
    if (!deferredSearch.length) {
      return [];
    }
    return fuse.search(deferredSearch).map((r) => r.item);
  }, [fuse, deferredSearch]);

  return (
    <div className={clsx('expanded-container overflow-hidden', className)}>
      <div className="flex">
        <Input
          dim="lg"
          className="w-full"
          placeholder="Search keyboard"
          value={search}
          allowClear
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <div className="mt-2 pt-4 pb-8 flex flex-col overflow-auto snap-y">
        {results.map((r) => (
          <Link
            key={r.key}
            className="snap-start cursor-pointer hover:bg-primary hover:text-white transition px-8 rounded"
            href={`/${r.key}`}
            onMouseEnter={() => {
              onKeyboardHover?.(r);
            }}
          >
            {r.name} <span>({r.qmkpath})</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
