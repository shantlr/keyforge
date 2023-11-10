import { nanoid } from 'nanoid';
import { useCallback, useEffect, useState } from 'react';

import { Keymap, keymapSlice, useDispatch } from '@/components/providers/redux';
import { MAX_LAYERS } from '@/constants';
import { KeyboardInfo, KeymapKeyDef } from '@/types';

import {
  useKeyDown,
  useListenKey,
  useRegisterKeyDown,
} from '../../providers/keymap';
import { KeymapWithLayers } from '../keymapWithLayers';

import { useListenKeyboardEvent } from './useListenKeyboardEvent';
import { useWindowBlur } from './useWindowBlur';

export const ConfiguratorKeymap = ({
  keyboard,
  keymap,
}: {
  keyboard: KeyboardInfo;
  keymap?: Keymap | null;
}) => {
  const dispatch = useDispatch();

  const keyIdxToEdit = useKeyDown();
  const setKeyIdxToEdit = useRegisterKeyDown();
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  useWindowBlur(
    useCallback(() => {
      setKeyIdxToEdit?.(undefined);
    }, [setKeyIdxToEdit])
  );

  // Auto select layer
  useEffect(() => {
    if (!keymap) {
      setSelectedLayerId(null);
    } else if (selectedLayerId == null) {
      setSelectedLayerId(keymap.layers[0]?.id);
    } else if (!keymap.layers.find((l) => l.id === selectedLayerId)) {
      setSelectedLayerId(keymap.layers[0]?.id);
    }
  }, [keymap, selectedLayerId]);

  const updateKey = (key: KeymapKeyDef) => {
    if (!keymap || !selectedLayerId || keyIdxToEdit == null) {
      return;
    }

    dispatch(
      keymapSlice.actions.updateKeymapLayerKey({
        id: keymap.id,
        keyIdx: keyIdxToEdit,
        key,
        layerId: selectedLayerId,
      })
    );

    if (keyIdxToEdit < keymap.layers[0].keys.length - 1) {
      setKeyIdxToEdit(keyIdxToEdit + 1);
    } else {
      setKeyIdxToEdit(undefined);
    }
  };

  useListenKey(({ key }) => {
    updateKey(key);
  });

  useListenKeyboardEvent(updateKey);

  if (!keyboard || !keymap || selectedLayerId == null) {
    return null;
  }

  return (
    <KeymapWithLayers
      keyboard={keyboard}
      usedLayout={keymap.layout}
      layers={keymap.layers}
      isKeyDown={
        keyIdxToEdit != null ? ({ index }) => index === keyIdxToEdit : undefined
      }
      onKeyClick={({ index }) => {
        if (index === keyIdxToEdit) {
          setKeyIdxToEdit(undefined);
        } else {
          setKeyIdxToEdit(index);
        }
      }}
      allowDropKey
      onKeyUpdate={({ value, index }) => {
        if (!selectedLayerId) {
          return;
        }

        dispatch(
          keymapSlice.actions.updateKeymapLayerKey({
            id: keymap?.id,
            keyIdx: index,
            key: value || '_______',
            layerId: selectedLayerId,
          })
        );
      }}
      onSwapKey={({ key1, key2 }) => {
        dispatch(
          keymapSlice.actions.swapKeys({
            keymapId: keymap.id,
            key1,
            key2,
          })
        );
      }}
      layerId={selectedLayerId}
      onRenameLayer={({ layerId, name }) => {
        dispatch(
          keymapSlice.actions.updateKeymapLayerName({
            id: keymap.id,
            layerId,
            name,
          })
        );
      }}
      onChangeLayer={(layerId) => {
        setSelectedLayerId(layerId);
      }}
      onLayerMove={({ srcIdx, dstIdx }) => {
        dispatch(
          keymapSlice.actions.moveKeymapLayer({
            id: keymap.id,
            srcIdx,
            dstIdx,
          })
        );
      }}
      onDuplicateLayer={(layerId) => {
        const layer = keymap?.layers.find((l) => l.id === layerId);
        if (layer) {
          dispatch(
            keymapSlice.actions.addKeymapLayer({
              id: keymap.id,
              keys: layer.keys,
              name: `${layer.name} copy`,
              layerId: nanoid(),
            })
          );
        }
      }}
      onLayerDelete={
        keymap.layers.length > 1
          ? (layer) => {
              dispatch(
                keymapSlice.actions.removeLayer({
                  id: keymap.id,
                  layerId: layer.id,
                })
              );
            }
          : undefined
      }
      onAddLayer={
        keymap.layers.length < MAX_LAYERS
          ? ({ name }) => {
              const id = nanoid();
              dispatch(
                keymapSlice.actions.addKeymapLayer({
                  id: keymap.id,
                  name,
                  layerId: id,
                  keys: keymap.layers[0].keys.map(() => '_______'),
                })
              );
              setSelectedLayerId(id);
            }
          : undefined
      }
    />
  );
};
