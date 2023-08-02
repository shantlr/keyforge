import { Button } from '@/components/base/button';
import { Input } from '@/components/base/input';
import { InputFit } from '@/components/base/inputFit';
import { Keymap } from '@/components/domain/keymap';
import { Keymap as KM } from '@/components/providers/redux';
import { KeyboardInfo } from '@/types';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentProps, useState } from 'react';

export const KeymapWithLayers = ({
  keyboard,
  usedLayout,
  layers,
  layerIdx: controllerLayerIdx,
  onChangeLayer,
  onAddLayer,
  ...props
}: Omit<ComponentProps<typeof Keymap>, 'keyPositions' | 'keys'> & {
  editable?: boolean;
  keyboard: KeyboardInfo;
  usedLayout: string;
  layers: KM['layers'];
  layerIdx?: number | null;
  onChangeLayer?: (layerIdx: number) => void;
  onAddLayer?: (arg: { name: string }) => void;
}) => {
  const [layerIndex, setLayerIndex] = useState(0);
  const [showNewLayerInput, setShowNewLayerInput] = useState(false);

  const [newLayerName, setNewLayerName] = useState('');

  const currentLayerIdx =
    typeof controllerLayerIdx === 'number' ? controllerLayerIdx : layerIndex;

  return (
    <div className="flex">
      <div className="mr-8 space-y-2">
        {Boolean(onAddLayer && showNewLayerInput) && (
          <InputFit
            value={newLayerName}
            size={8}
            onChange={(e) => {
              setNewLayerName(e.target.value);
            }}
            autoFocus
            onKeyUp={(e) => {
              if (e.code === 'Enter') {
                onAddLayer?.({ name: newLayerName });
                setShowNewLayerInput(false);
              }
            }}
            onBlur={() => {
              setShowNewLayerInput(false);
            }}
          />
        )}
        {Boolean(onAddLayer) && !showNewLayerInput && (
          <Button
            onPress={() => {
              setNewLayerName('');
              setShowNewLayerInput(true);
            }}
            colorScheme="dashed"
            className="w-full"
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        )}
        {[...layers].reverse().map((l, idx) => {
          const actualIdx = layers.length - idx - 1;
          return (
            <Button
              colorScheme={
                currentLayerIdx === actualIdx ? 'primary' : 'default'
              }
              className="w-full text-sm"
              key={idx}
              onPress={() => {
                if (typeof controllerLayerIdx != 'number') {
                  setLayerIndex(actualIdx);
                }
                onChangeLayer?.(actualIdx);
              }}
            >
              {l.name}
            </Button>
          );
        })}
      </div>
      <Keymap
        keyPositions={keyboard.layouts?.[usedLayout]?.layout}
        keys={layers[currentLayerIdx]?.keys}
        {...props}
      />
    </div>
  );
};
