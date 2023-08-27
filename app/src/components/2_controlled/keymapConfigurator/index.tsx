'use client';

import { KeyboardInfo, KeymapKeyDef } from '@/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isEqual, map } from 'lodash';
import { $$getExistingKeymap } from '@/actions/getExisingKeymap';
import { Button } from '../../0_base/button';
import { KeysPicker } from '../keysPicker';
import { Disclosure } from '@/components/0_base/disclosure';
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
import { useWindowBlur } from './useWindowBlur';
import { useClickOutside } from './useClickOutside';
import { nanoid } from 'nanoid';
import { Tooltip } from '@/components/0_base/tooltips';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';

export const KeymapConfigurator = ({
  keyboardKey,
  keyboard,
  keymaps,
  onSelectKeymap,
}: {
  keyboardKey: string;
  keyboard: KeyboardInfo;
  keymaps: ExistingKeymap[];
  onSelectKeymap?: (keymapId: string | null) => void;
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

  const handleSelectKeymap = useCallback(
    async (key: string) => {
      const keymap = await $$getExistingKeymap({
        keyboardKey,
        keymap: key as string,
      });
      setKeymap(keymap);
    },
    [keyboardKey]
  );

  useEffect(() => {
    if (!keymap && keyboard.keymaps.length) {
      handleSelectKeymap(keyboard.keymaps[0]);
    }
  }, [keymap, keyboard, handleSelectKeymap]);

  const dispatch = useDispatch();

  const selectedKeymap = useSelector((state) => {
    const keymapId =
      state.view.selectedKeymap?.[keyboardKey]?.lastSelectedKeymap;
    if (keymapId && state.keymaps.keymaps[keymapId]) {
      return state.keymaps.keymaps[keymapId];
    }
    return null;
  });

  useEffect(() => {
    onSelectKeymap?.(selectedKeymap?.id ?? null);
  }, [onSelectKeymap, selectedKeymap?.id]);

  const userKeymaps = useSelector(
    (state) =>
      state.keymaps.keyboards[keyboardKey]?.keymaps.map(
        (k) => state.keymaps.keymaps[k]
      ),
    (prev, next) => {
      return isEqual(prev, next);
    }
  );

  const [showUserKeymaps, setShowUserKeymaps] = useState(
    Boolean(selectedKeymap)
  );
  const [showLayouts, setShowLayouts] = useState(!Boolean(selectedKeymap));

  const [keyIdxToEdit, setKeyIdxToEdit] = useState<number | null>(null);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedKeymap) {
      setSelectedLayerId(null);
    } else if (selectedLayerId == null) {
      setSelectedLayerId(selectedKeymap.layers[0]?.id);
    } else if (!selectedKeymap.layers.find((l) => l.id === selectedLayerId)) {
      setSelectedLayerId(selectedKeymap.layers[0]?.id);
    }
  }, [selectedKeymap, selectedLayerId]);

  useEffect(() => {
    if (!selectedKeymap || selectedLayerId == null || keyIdxToEdit == null) {
      return;
    }
  }, [keyIdxToEdit, selectedKeymap, selectedLayerId]);

  const updateKey = useCallback(
    (key: KeymapKeyDef) => {
      if (!selectedKeymap || selectedLayerId == null || keyIdxToEdit == null) {
        return;
      }

      dispatch(
        keymapSlice.actions.updateKeymapLayerKey({
          id: selectedKeymap?.id,
          keyIdx: keyIdxToEdit,
          key,
          layerId: selectedLayerId,
        })
      );

      if (keyIdxToEdit < selectedKeymap.layers[0].keys.length - 1) {
        setKeyIdxToEdit(keyIdxToEdit + 1);
      } else {
        setKeyIdxToEdit(null);
      }
    },
    [dispatch, keyIdxToEdit, selectedKeymap, selectedLayerId]
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
    Boolean(selectedKeymap && selectedLayerId != null && keyIdxToEdit != null)
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
            contentClassName="py-2 pl-2 space-y-1"
            show={showUserKeymaps}
            onVisibilityChange={setShowUserKeymaps}
          >
            {userKeymaps?.map((k) => (
              <Tooltip
                key={k.id}
                delay={0}
                closeDelay={200}
                placement="right"
                tooltip={
                  <div className="flex space-x-1">
                    <Button
                      className="text-[10px] px-[6px] bg-mainbg"
                      onPress={() => {
                        dispatch(
                          keymapSlice.actions.addKeymap({
                            keyboard: keyboardKey,
                            layers: k.layers,
                            layout: k.layout,
                            name: `${k.name} copy`,
                            replaceTemp: true,
                          })
                        );
                      }}
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </Button>
                    <Button
                      className="text-[10px] px-[6px] bg-mainbg"
                      onPress={() => {
                        dispatch(
                          keymapSlice.actions.removeKeymap({
                            id: k.id,
                            keyboard: keyboardKey,
                          })
                        );
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                }
              >
                <input
                  className={clsx(
                    'outline-none px-2 h-input-md rounded text-sm hover:bg-primary-lighter transition',
                    {
                      'bg-primary text-mainbg placeholder:text-secondarybg':
                        k.id === selectedKeymap?.id,
                      'bg-transparent text-default placeholder:text-secondarybg':
                        k.id !== selectedKeymap?.id,
                      italic: k.temp,
                    }
                  )}
                  placeholder="<unamed-keymap>"
                  value={k.name}
                  onClick={() => {
                    dispatch(
                      viewSlice.actions.selectKeymap({
                        keyboard: keyboardKey,
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
              </Tooltip>
            ))}
          </Disclosure>

          <Disclosure
            titleClassName="sticky top-[0px]"
            title="From scratch - Layouts"
            contentClassName="py-2 pl-2 space-y-1"
            show={showLayouts}
            onVisibilityChange={setShowLayouts}
          >
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
                      keyboard: keyboardKey,
                      layout: l.name,
                      layers: [
                        { name: '1', keys: l.layout.map(() => 'KC_NO') },
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
          </Disclosure>
          <Disclosure
            title="From existing keymap"
            titleClassName="sticky top-[0px]"
            contentClassName="py-2 pl-2"
          >
            {keymaps.map((k, idx) => (
              <Button
                key={idx}
                className="text-sm"
                colorScheme="text"
                onPress={() => {
                  dispatch(
                    keymapSlice.actions.addKeymap({
                      keyboard: keyboardKey,
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
            {!keymaps.length && <div className="text-sm">No known keymaps</div>}
          </Disclosure>
        </div>
        <div className="w-full flex" ref={keymapRef}>
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
              onKeyUpdate={({ value, index }) => {
                if (!selectedLayerId) {
                  return;
                }

                dispatch(
                  keymapSlice.actions.updateKeymapLayerKey({
                    id: selectedKeymap?.id,
                    keyIdx: index,
                    key: value || '_______',
                    layerId: selectedLayerId,
                  })
                );
              }}
              paramsEditable
              layerId={selectedLayerId}
              onChangeLayer={(layerId) => {
                setSelectedLayerId(layerId);
              }}
              onLayerMove={({ srcIdx, dstIdx }) => {
                dispatch(
                  keymapSlice.actions.moveKeymapLayer({
                    id: selectedKeymap.id,
                    srcIdx,
                    dstIdx,
                  })
                );
              }}
              onDuplicateLayer={(layerId) => {
                const layer = selectedKeymap?.layers.find(
                  (l) => l.id === layerId
                );
                if (layer) {
                  dispatch(
                    keymapSlice.actions.addKeymapLayer({
                      id: selectedKeymap.id,
                      keys: layer.keys,
                      name: `${layer.name} copy`,
                      layerId: nanoid(),
                    })
                  );
                }
              }}
              onLayerDelete={
                selectedKeymap.layers.length > 1
                  ? (layer) => {
                      dispatch(
                        keymapSlice.actions.removeLayer({
                          id: selectedKeymap.id,
                          layerId: layer.id,
                        })
                      );
                    }
                  : undefined
              }
              onAddLayer={
                selectedKeymap.layers.length < MAX_LAYERS
                  ? ({ name }) => {
                      const id = nanoid();
                      dispatch(
                        keymapSlice.actions.addKeymapLayer({
                          id: selectedKeymap.id,
                          name,
                          layerId: id,
                          keys: selectedKeymap.layers[0].keys.map(
                            () => '_______'
                          ),
                        })
                      );
                      setSelectedLayerId(id);
                    }
                  : undefined
              }
            />
          )}
        </div>
      </div>

      <div className="mt-4 mb-4 expanded-container w-full h-full flex items-center justify-center">
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
