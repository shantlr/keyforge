'use client';

import { KeyboardInfo } from '@/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isEqual, map } from 'lodash';
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
import clsx from 'clsx';
import { MAX_LAYERS } from '@/constants';
import { useListenKeyboardEvent } from './useListenKeyboardEvent';
import { useEffectEvent } from '@react-aria/utils';
import { useWindowBlur } from './useWindowBlur';
import { useClickOutside } from './useClickOutside';

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
      return isEqual(prev, next);
    }
  );

  const [showUserKeymaps, setShowUserKeymaps] = useState(false);
  const [showLayouts, setShowLayouts] = useState(true);

  const [keyIdxToEdit, setKeyIdxToEdit] = useState<number | null>(null);
  const [selectedLayerIdx, setSelectedLayerIdx] = useState<number | null>(0);

  useEffect(() => {
    if (!selectedKeymap) {
      setSelectedLayerIdx(null);
    } else if (selectedLayerIdx == null) {
      setSelectedLayerIdx(0);
    }
  }, [selectedKeymap, selectedLayerIdx]);

  useEffect(() => {
    if (!selectedKeymap || selectedLayerIdx == null || keyIdxToEdit == null) {
      return;
    }
  }, [keyIdxToEdit, selectedKeymap, selectedLayerIdx]);

  const updateKey = useCallback(
    (key: string) => {
      if (!selectedKeymap || selectedLayerIdx == null || keyIdxToEdit == null) {
        return;
      }

      dispatch(
        keymapSlice.actions.updateKeymapLayerKey({
          id: selectedKeymap?.id,
          keyIdx: keyIdxToEdit,
          key,
          layerIdx: selectedLayerIdx,
        })
      );

      if (
        keyIdxToEdit <
        selectedKeymap.layers[selectedLayerIdx].keys.length - 1
      ) {
        setKeyIdxToEdit(keyIdxToEdit + 1);
      } else {
        setKeyIdxToEdit(null);
      }
    },
    [dispatch, keyIdxToEdit, selectedKeymap, selectedLayerIdx]
  );

  const keymapRef = useRef<HTMLDivElement>(null);
  // reset down key when click outside
  useClickOutside(
    keymapRef,
    useCallback(() => {
      setKeyIdxToEdit(null);
    }, [])
  );

  // update key using keyboard
  useListenKeyboardEvent(
    updateKey,
    Boolean(selectedKeymap && selectedLayerIdx != null && keyIdxToEdit != null)
  );
  // reset down key on window blur
  useWindowBlur(
    useCallback(() => {
      setKeyIdxToEdit(null);
    }, [])
  );

  return (
    <div className="expanded-container overflow-hiddden px-4">
      <div className="h-full flex overflow-hidden h-full flex">
        <div className="h-full mr-8 space-y-1 overflow-y-auto relative w-[220px] shrink-0">
          <Disclosure
            title="Your keymaps"
            titleClassName="sticky top-[0px]"
            show={showUserKeymaps}
            onVisibilityChange={setShowUserKeymaps}
          >
            <div className="pl-2 space-y-1">
              {userKeymaps?.map((k) => (
                <input
                  className={clsx(
                    'outline-none px-2 h-input-md rounded text-sm hover:bg-primary-lighter transition',
                    {
                      'bg-primary': k.id === selectedKeymap?.id,
                      'bg-transparent text-default placeholder:text-secondarybg':
                        k.id !== selectedKeymap?.id,
                      italic: k.temp,
                    }
                  )}
                  placeholder="<unamed-keymap>"
                  key={k.id}
                  value={k.name}
                  onClick={() => {
                    dispatch(
                      viewSlice.actions.selectKeymap({
                        keyboard: keyboardId,
                        keymapId: k.id,
                      })
                    );
                  }}
                  onChange={(e) => {
                    dispatch(
                      keymapSlice.actions.updateKeymapName({
                        id: k.id,
                        name: e.target.value,
                      })
                    );
                  }}
                />
              ))}
            </div>
          </Disclosure>

          <Disclosure
            titleClassName="sticky top-[0px]"
            title="From scratch - Layouts"
            show={showLayouts}
            onVisibilityChange={setShowLayouts}
          >
            <div className="pl-2">
              {layouts.map((l) => (
                <Button
                  key={l.name}
                  colorScheme="text"
                  className={clsx('items-start text-sm', {
                    'border-dashed border-default':
                      l.name === selectedKeymap?.layout,
                  })}
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
                    setShowUserKeymaps(true);
                  }}
                >
                  {l.name}
                </Button>
              ))}
            </div>
          </Disclosure>
          <Disclosure
            title="From existing keymap"
            titleClassName="sticky top-[0px]"
          >
            <div className="pl-2">
              {keymaps.map((k, idx) => (
                <Button
                  key={idx}
                  className="text-sm"
                  colorScheme="text"
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
                    setShowUserKeymaps(true);
                  }}
                >
                  {k.name}
                </Button>
              ))}
              {!keymaps.length && (
                <div className="text-sm">No known keymaps</div>
              )}
            </div>
          </Disclosure>
        </div>
        <div className="w-full flex justify-center" ref={keymapRef}>
          {Boolean(keyboard) && selectedKeymap != null && (
            <KeymapWithLayers
              keyboard={keyboard}
              usedLayout={selectedKeymap.layout}
              layers={selectedKeymap.layers}
              isKeyDown={
                keyIdxToEdit != null
                  ? ({ index }) => index === keyIdxToEdit
                  : undefined
              }
              onKeyClick={({ index }) => {
                if (index === keyIdxToEdit) {
                  setKeyIdxToEdit(null);
                } else {
                  setKeyIdxToEdit(index);
                }
              }}
              layerIdx={selectedLayerIdx}
              onChangeLayer={(layerIdx) => {
                setSelectedLayerIdx(layerIdx);
              }}
              onAddLayer={
                selectedKeymap.layers.length < MAX_LAYERS
                  ? ({ name }) => {
                      dispatch(
                        keymapSlice.actions.addKeymapLayer({
                          id: selectedKeymap.id,
                          name,
                          keys: selectedKeymap.layers[0].keys.map(
                            () => '_____'
                          ),
                        })
                      );
                      setSelectedLayerIdx(selectedKeymap.layers.length);
                    }
                  : undefined
              }
            />
          )}
        </div>
      </div>

      <div className="mt-4 expanded-container rounded bg-secondarybg w-full h-full flex items-center justify-center">
        <KeysPicker
          onKeyClick={({ key }) => {
            if (key) {
              updateKey(key);
            }
          }}
        />
      </div>
    </div>
  );
};
