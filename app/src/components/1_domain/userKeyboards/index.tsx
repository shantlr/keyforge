'use client';

import { sortBy } from 'lodash';
import Link from 'next/link';

import { useSelector } from '@/components/providers/redux';

export const UserKeyboards = ({
  onKeyboardHover,
}: {
  onKeyboardHover?: (key: string) => void;
}) => {
  const userKeyboards = useSelector((state) => {
    const keys = Object.keys(state.keymaps.keyboards);
    return sortBy(keys);
  });

  if (!userKeyboards.length) {
    return null;
  }

  return (
    <div className="grid">
      <div className="mb-2 text-default-darker">Your keyboards:</div>
      {userKeyboards.map((key) => (
        <Link
          className="inline-block snap-start text-default-darker cursor-pointer hover:bg-primary hover:text-white transition px-8 rounded"
          href={`/${key}`}
          key={key}
          onMouseEnter={() => {
            onKeyboardHover?.(key);
          }}
        >
          {key}
        </Link>
      ))}
    </div>
  );
};
