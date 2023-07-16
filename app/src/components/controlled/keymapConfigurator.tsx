'use client';

import { KeyboardInfo } from '@/types';
import { Keymap } from '../keymap';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Select } from '../base/select';
import { map, reverse } from 'lodash';
import { Item } from 'react-stately';
import { getExistingKeymap } from '@/actions/getExisingKeymap';
import { Button } from '../base/button';
import clsx from 'clsx';
import { KeysPicker } from './keysPicker';

export const KeymapConfigurator = ({
  keyboardId,
  keyboard,
}: {
  keyboardId: string;
  keyboard: KeyboardInfo;
}) => {
  const layouts = useMemo(
    () =>
      map(keyboard?.layouts, (l, name) => ({
        name,
        ...l,
      })),
    [keyboard?.layouts]
  );
  const [layout, setLayout] = useState(() => layouts[0]?.name);

  const [keymap, setKeymap] = useState<{
    name: string;
    layers: {
      name: string;
      keys: string[];
    }[];
  } | null>(null);
  const [layerIdx, setLayerIdx] = useState(0);

  const onSelectKeymap = useCallback(
    async (key: string) => {
      const keymap = await getExistingKeymap({
        keyboard: keyboardId,
        keymap: key as string,
      });
      setKeymap(keymap);
    },
    [keyboardId]
  );

  useEffect(() => {
    if (!keymap && keyboard.keymaps.length) {
      onSelectKeymap(keyboard.keymaps[0]);
    }
  }, [keymap, keyboard, onSelectKeymap]);

  return (
    <div>
      {layouts.length > 1 && (
        <div className="flex mb-4">
          <div className="text-primary-lighter mr-2">Pick your layout</div>
          <Select
            selectedKey={layout}
            onSelectionChange={(key) => {
              setLayout(key as string);
            }}
          >
            {layouts.map((l) => (
              <Item key={l.name} aria-label={l.name}>
                {l.name}
              </Item>
            ))}
          </Select>
        </div>
      )}
      <div className="flex">
        <div className="text-primary-lighter">From keymap:</div>
        <Select
          className="ml-2"
          selectedKey={keymap?.name}
          onSelectionChange={async (key) => {
            onSelectKeymap(key as string);
          }}
        >
          {keyboard.keymaps.map((k) => (
            <Item key={k} aria-label={k}>
              {k}
            </Item>
          ))}
        </Select>
      </div>

      {/* Layers */}
      <div className="flex mt-4">
        <div className="text-white flex flex-col mr-8 space-y-2">
          {(keymap?.layers || [])
            .slice()
            ?.reverse()
            ?.map((layer, idx) => (
              <Button
                className={clsx('transition', {
                  'translate-x-4':
                    (keymap?.layers.length || 0) - idx === layerIdx + 1,
                  'translate-x-0':
                    (keymap?.layers.length || 0) - idx !== layerIdx + 1,
                })}
                key={layer.name}
                onPress={() => {
                  if (keymap) {
                    setLayerIdx(keymap.layers.length - idx - 1);
                  }
                }}
              >
                LAYER_{layer.name}
              </Button>
            ))}
        </div>

        <Keymap
          keyboard={keyboard}
          layout={layout}
          keys={keymap?.layers?.[layerIdx]?.keys}
        />
      </div>
      <div className="rounded bg-primary w-full h-full">
        <KeysPicker />
      </div>
    </div>
  );
};
