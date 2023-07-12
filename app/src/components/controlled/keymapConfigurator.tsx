'use client';

import { KeyboardInfo } from '@/types';
import { Keymap } from '../keymap';
import { useMemo, useState } from 'react';
import { Select } from '../base/select';
import { map } from 'lodash';
import { Item } from 'react-stately';

export const KeymapConfigurator = ({
  keyboard,
}: {
  keyboard: KeyboardInfo;
}) => {
  const layouts = useMemo(
    () =>
      map(keyboard.layouts, (l, name) => ({
        name,
        ...l,
      })),
    [keyboard.layouts]
  );
  const [layout, setLayout] = useState(() => layouts[0]?.name);

  return (
    <div>
      {layouts.length > 1 && (
        <div className="flex mb-4">
          <div className="text-primary mr-2">Pick your layout</div>
          <Select
            // items={layouts}
            selectedKey={layout}
            onSelectionChange={(key) => {
              setLayout(key as string);
            }}
          >
            {layouts.map((l) => (
              <Item key={l.name}>{l.name}</Item>
            ))}
          </Select>
        </div>
      )}
      <Keymap keyboard={keyboard} layout={layout} />
    </div>
  );
};
