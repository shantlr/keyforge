'use client';

import { useRouter } from 'next/navigation';
import { useDeferredValue, useMemo, useState } from 'react';
import Fuse from 'fuse.js';

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
          className="px-6 py-1 w-full rounded max-w-[350px] outline-none"
          placeholder="Search keyboard"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <div className="mt-2 pt-4 pb-8 flex flex-col items-center overflow-auto">
        {results.map((r) => (
          <div
            key={r.key}
            className="cursor-pointer hover:bg-primary hover:text-white transition px-8 rounded"
            onClick={() => {
              router.push(`/${r.key}`);
            }}
          >
            {r.name} <span>({r.qmkpath})</span>
          </div>
        ))}
      </div>
    </div>
  );
};
