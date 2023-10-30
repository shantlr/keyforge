'use client';

import Fuse from 'fuse.js';
import { sortBy } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDeferredValue, useMemo, useState } from 'react';

import { useSelector } from '../providers/redux';

export const SelectKeyboard = ({
  value,
  className,
  keyboards,
}: {
  value?: string | null;
  className?: string;
  keyboards: { name: string; key: string; qmkpath: string }[];
}) => {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const deferredSearch = useDeferredValue(search);

  const [fuse] = useState(
    () =>
      new Fuse(keyboards, {
        keys: ['key'],
      })
  );

  const userKeyboards = useSelector((state) => {
    const keys = Object.keys(state.keymaps.keyboards);
    return sortBy(keys);
  });

  const results = useMemo(() => {
    if (!deferredSearch.length) {
      return [];
    }
    return fuse.search(deferredSearch).map((r) => r.item);
  }, [fuse, deferredSearch]);

  return (
    <div className="expanded-container overflow-hidden">
      <div className="flex justify-center items-center">
        <input
          className="px-6 py-1 w-full border-2 bg-mainbg text-primary border-default hover:border-primary focus:border-primary transition rounded max-w-[350px] outline-none"
          placeholder="Search keyboard"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <div className="mt-2 pt-4 pb-8 flex flex-col items-center overflow-auto snap-y">
        {!results.length && userKeyboards.length > 0 && (
          <>
            <div className="mb-2 text-default-darker">Your keyboards:</div>
            {userKeyboards.map((key) => (
              <Link
                className="snap-start text-default-darker cursor-pointer hover:bg-primary hover:text-white transition px-8 rounded"
                href={`/${key}`}
                key={key}
              >
                {key}
              </Link>
            ))}
          </>
        )}
        {results.map((r) => (
          <Link
            key={r.key}
            className="snap-start cursor-pointer hover:bg-primary hover:text-white transition px-8 rounded"
            href={`/${r.key}`}
          >
            {r.name} <span>({r.qmkpath})</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
