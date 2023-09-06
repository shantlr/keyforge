'use client';

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { KeyboardInfo } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isEqual, map } from 'lodash';
import { $$getExistingKeymap } from '@/actions/getExisingKeymap';
import { Button } from '../../0_base/button';
import { Disclosure } from '@/components/0_base/disclosure';
import {
  keymapSlice,
  useDispatch,
  useSelector,
} from '@/components/providers/redux';
import { viewSlice } from '@/components/providers/redux/slices/view';
import { ExistingKeymap } from '@/lib/keyboards';
import clsx from 'clsx';
import { Tooltip } from '@/components/0_base/tooltips';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';
import { InputButton } from '@/components/0_base/inputButton';
import { KeyContext } from './keyContext';
import { ConfiguratorKeyPicker } from './keyPicker';
import { ConfiguratorKeymap } from './keymap';
import { ConfiguratorDraggableOverlay } from './dragOverlay';

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // delay: 500,
        distance: 8,
      },
    })
  );

  return (
    <DndContext sensors={sensors}>
      <KeyContext>
        <div className="expanded-container overflow-hiddden px-4">
          <div className="h-full flex grow-1 shrink-1 overflow-hidden">
            <div className="h-full mr-8 space-y-1 overflow-y-auto relative w-[220px] shrink-0">
              <Disclosure
                title="Your keymaps"
                titleClassName="sticky top-[0px]"
                contentClassName="py-2 px-2 space-y-1"
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
                    <InputButton
                      active={k.id === selectedKeymap?.id}
                      colorScheme="text"
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
                            name: (e.target as HTMLInputElement).value,
                          })
                        );
                      }}
                      value={k.name}
                      placeholder="<unamed-keymap>"
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
                {!keymaps.length && (
                  <div className="text-sm">No known keymaps</div>
                )}
              </Disclosure>
            </div>
            <div className="w-full flex">
              <ConfiguratorKeymap keyboard={keyboard} keymap={selectedKeymap} />
            </div>
          </div>

          <div className="h-[330px] shrink-0 grow-0 mt-4 mb-4 expanded-container w-full flex items-center justify-center">
            <ConfiguratorKeyPicker />
          </div>
        </div>
      </KeyContext>
      <ConfiguratorDraggableOverlay />
    </DndContext>
  );
};
