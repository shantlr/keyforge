import { Button } from '@/components/base/button';
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
  onChangeLayer,
  onAddLayer,
  ...props
}: Omit<ComponentProps<typeof Keymap>, 'keyPositions' | 'keys'> & {
  editable?: boolean;
  keyboard: KeyboardInfo;
  usedLayout: string;
  layers: KM['layers'];
  onChangeLayer?: (layerIdx: number) => void;
  onAddLayer?: () => void;
}) => {
  const [layerIndex, setLayerIndex] = useState(0);
  const [showNewLayerInput, setShowNewLayerInput] = useState(false);

  return (
    <div className="flex">
      <div className="mr-8 space-y-2">
        {Boolean(onAddLayer && showNewLayerInput) && <input />}
        {Boolean(onAddLayer) && !showNewLayerInput && (
          <Button
            onPress={() => {
              setShowNewLayerInput(true);
              //
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
              colorScheme={actualIdx === layerIndex ? 'primary' : 'default'}
              className="w-full"
              key={idx}
              onPress={() => {
                setLayerIndex(actualIdx);
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
        keys={layers[layerIndex]?.keys}
        {...props}
      />
    </div>
  );
};
