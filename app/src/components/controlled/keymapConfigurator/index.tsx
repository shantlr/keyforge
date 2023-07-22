'use client';

import { KeyboardInfo } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { map } from 'lodash';
import { getExistingKeymap } from '@/actions/getExisingKeymap';
import { Button } from '../../base/button';
import { KeysPicker } from '../keysPicker';
import { Disclosure } from '@/components/base/disclosure';
import {
  keymapSlice,
  useDispatch,
  useSelector,
} from '@/components/providers/redux';
import { KeymapWithLayers } from '../keymapWithLayers';
import { viewSlice } from '@/components/providers/redux/slices/view';
import { ExistingKeymap } from '@/lib/keyboards';

export const KeymapConfigurator = ({
  keyboardId,
  keyboard,
  keymaps,
}: {
  keyboardId: string;
  keyboard: KeyboardInfo;
  keymaps: ExistingKeymap[];
}) => {
  const layouts = useMemo(
    () =>
      map(keyboard?.layouts, (l, name) => ({
        name,
        ...l,
      })),
    [keyboard?.layouts]
  );

  const [keymap, setKeymap] = useState<{
    name: string;
    layers: {
      name: string;
      keys: string[];
    }[];
  } | null>(null);

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

  const dispatch = useDispatch();

  const selectedKeymap = useSelector((state) => {
    const keymapId =
      state.view.selectedKeymap?.[keyboardId]?.lastSelectedKeymap;
    if (keymapId && state.keymaps.keymaps[keymapId]) {
      return state.keymaps.keymaps[keymapId];
    }
    return null;
  });

  const userKeymaps = useSelector(
    (state) =>
      state.keymaps.keyboards[keyboardId]?.keymaps.map(
        (k) => state.keymaps.keymaps[k]
      ),
    (prev, next) => {
      return (
        prev?.map((p) => p.id).join('::') === next?.map((p) => p.id).join('::')
      );
    }
  );

  console.log({
    keyboard,
    selectedKeymap,
  });

  return (
    <div className="expanded-container overflow-hiddden px-4">
      <div className="h-full flex overflow-hidden h-full flex">
        <div className="expanded-container mr-8 space-y-1 overflow-y-hidden">
          <Disclosure
            title="Your keymaps"
            containerClassName="h-full space-y-1"
          >
            {userKeymaps?.map((k) => (
              <Button
                key={k.id}
                colorScheme={k.id === selectedKeymap?.id ? 'primary' : 'text'}
                onPress={() => {
                  dispatch(
                    viewSlice.actions.selectKeymap({
                      keyboard: keyboardId,
                      keymapId: k.id,
                    })
                  );
                }}
              >
                {k.name}
              </Button>
            ))}
          </Disclosure>
          <Disclosure
            className="mb-2"
            containerClassName="space-y-1"
            title="From scratch - Layouts"
          >
            {layouts.map((l) => (
              <Button
                key={l.name}
                colorScheme="text"
                onPress={() => {
                  dispatch(
                    keymapSlice.actions.addKeymap({
                      name: '',
                      keyboard: keyboardId,
                      layout: l.name,
                      layers: [
                        { name: '1', keys: l.layout.map(() => 'KC_NOOP') },
                      ],
                      temp: true,
                      replaceTemp: true,
                    })
                  );
                }}
              >
                {l.name}
              </Button>
            ))}
          </Disclosure>
          <Disclosure
            title="From existing keymap"
            className="flex flex-col overflow-hidden"
            containerClassName="overflow-y-auto space-y-1"
          >
            {keymaps.map((k, idx) => (
              <Button
                key={idx}
                onPress={() => {
                  dispatch(
                    keymapSlice.actions.addKeymap({
                      keyboard: keyboardId,
                      layout: k.layout,
                      layers: k.layers,
                      name: `Copy ${k.name}`,
                      replaceTemp: true,
                      temp: true,
                    })
                  );
                }}
              >
                {k.name}
              </Button>
            ))}
          </Disclosure>
        </div>
        <div className="w-full flex justify-center">
          {Boolean(keyboard) && selectedKeymap != null && (
            <KeymapWithLayers
              keyboard={keyboard}
              usedLayout={selectedKeymap.layout}
              layers={selectedKeymap.layers}
            />
          )}
        </div>
      </div>

      <div className="mt-4 expanded-container rounded bg-secondarybg w-full h-full flex items-center justify-center">
        <KeysPicker />
      </div>
    </div>
  );
};
