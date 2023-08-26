'use client';

import { Item } from 'react-stately';
import { useRouter } from 'next/navigation';
import { ComboBox } from '../0_base/comboBox';

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
  return (
    <ComboBox
      aria-label="select your keyboard"
      className={className}
      selectedKey={value}
      onSelectionChange={(key) => {
        router.push(`/${key}`);
      }}
      defaultItems={keyboards}
    >
      {(item) => (
        <Item key={item.key} textValue={`${item.name} (${item.qmkpath})`}>
          <span className="text-sm">
            {item.name} <span className="text-gray-400">({item.qmkpath})</span>
          </span>
        </Item>
      )}
    </ComboBox>
  );
};
