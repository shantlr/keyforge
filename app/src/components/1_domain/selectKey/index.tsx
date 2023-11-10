import Fuse from 'fuse.js';
import { ComponentProps, useDeferredValue, useMemo, useState } from 'react';

import { Combobox } from '@/components/0_base/comboBox';
import { GenericKey, KEYS } from '@/constants';

import { QMKKey } from '../qmkKey';

export const SelectKey = (
  props: Omit<
    ComponentProps<typeof Combobox<GenericKey>>,
    'input' | 'onInputChange' | 'options' | 'getKey' | 'renderOption'
  >
) => {
  const [text, setText] = useState('');
  const deferredSearch = useDeferredValue(text);

  const [fuse] = useState(
    () =>
      new Fuse(KEYS, {
        keys: ['title', 'description', 'key', 'aliases'],
      })
  );

  const results = useMemo(() => {
    if (!deferredSearch.length) {
      return [];
    }
    return fuse.search(deferredSearch).map((r) => r.item);
  }, [fuse, deferredSearch]);

  return (
    <Combobox
      {...props}
      input={text}
      onInputChange={setText}
      options={results as GenericKey[]}
      getOptionKey={(item) => item?.key ?? ''}
      onSelect={(item) => {
        props.onSelect?.(item);
        setText('');
      }}
      renderOption={(item) => (
        <div className="flex items-center py-1">
          <QMKKey
            keyDef={{
              key: item.key,
              params: item.params as any,
            }}
            width={24}
            height={24}
            textSize="text-[6px]"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <span className="pl-2 text-sm">
            {item.description || item.title || item.key}
          </span>
        </div>
      )}
    />
  );
};
