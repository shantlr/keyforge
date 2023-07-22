import { Button } from '@/components/base/button';
import { Keymap } from '@/components/keymap';
import { Keymap as KM } from '@/components/providers/redux';
import { KeyboardInfo } from '@/types';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentProps, useState } from 'react';

export const KeymapWithLayers = ({
  keyboard,
  usedLayout,
  layers,
  baseWidth,
  keySepWidth,
}: Omit<ComponentProps<typeof Keymap>, 'keyPositions' | 'keys'> & {
  editable?: boolean;
  keyboard: KeyboardInfo;
  usedLayout: string;
  layers: KM['layers'];
  onChangeLayer?: () => void;
  onKeyChanges?: () => void;
}) => {
  const [layerIndex, setLayerIndex] = useState(0);

  return (
    <div className="flex">
      <div className="mr-8 space-y-2">
        <Button
          onPress={() => {
            //
          }}
          colorScheme="dashed"
          className="w-full"
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>
        {[...layers].reverse().map((l, idx) => {
          const actualIdx = layers.length - idx - 1;
          return (
            <Button
              colorScheme={actualIdx === layerIndex ? 'primary' : 'default'}
              className="w-full"
              key={idx}
              onPress={() => {
                setLayerIndex(actualIdx);
              }}
            >
              {l.name}
            </Button>
          );
        })}
      </div>
      <Keymap
        // keyPositions={keyPositions}
        keyPositions={keyboard.layouts?.[usedLayout]?.layout}
        baseWidth={baseWidth}
        keySepWidth={keySepWidth}
        keys={layers[layerIndex]?.keys}
      />
    </div>
  );
};
