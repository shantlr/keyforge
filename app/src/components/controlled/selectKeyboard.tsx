'use client';

import { Item } from 'react-stately';
import { Select } from '../base/select';
import { useRouter } from 'next/navigation';

export const SelectKeyboard = ({
  value,
  className,
  keyboards,
}: {
  value?: string | null;
  className?: string;
  keyboards: { name: string; path: string }[];
}) => {
  const router = useRouter();
  return (
    <Select
      aria-label="select your keyboard"
      className={className}
      selectedKey={value}
      onSelectionChange={(key) => {
        router.push(`/${key}`);
      }}
      items={keyboards}
    >
      {(item) => (
        <Item key={item.path} textValue={`${item.name} (${item.path})`}>
          <span className="text-sm">
            {item.name} <span className="text-gray-400">({item.path})</span>
          </span>
        </Item>
      )}
    </Select>
  );
};
