import { Button } from '@/components/0_base/button';
import { Input } from '@/components/0_base/input';
import { InputFit } from '@/components/0_base/inputFit';
import { Keymap } from '@/components/1_domain/keymap';
import { Keymap as KM } from '@/components/providers/redux';
import { KeyboardInfo } from '@/types';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentProps, useState } from 'react';
import { Layers } from './layers';

export const KeymapWithLayers = ({
  keyboard,
  usedLayout,
  layers,
  layerId: controlledLayerId,
  onChangeLayer,
  onAddLayer,
  onLayerMove,
  onLayerDelete,
  ...props
}: Omit<ComponentProps<typeof Keymap>, 'keyPositions' | 'keys'> & {
  editable?: boolean;
  keyboard: KeyboardInfo;
  usedLayout: string;
  layers: KM['layers'];
  layerId?: string | null;
  onChangeLayer?: (layerId: string) => void;
  onAddLayer?: (arg: { name: string }) => void;
  onLayerMove?: (arg: { srcIdx: number; dstIdx: number }) => void;
  onLayerDelete?: (layer: KM['layers'][number]) => void;
}) => {
  const [localSelectedLayerId, setLocalSelectedLayerId] = useState<string>(
    layers[0].id
  );
  const [showNewLayerInput, setShowNewLayerInput] = useState(false);

  const [newLayerName, setNewLayerName] = useState('');

  const currentLayerId =
    typeof controlledLayerId === 'string'
      ? controlledLayerId
      : localSelectedLayerId;

  return (
    <div className="flex">
      <div className="mr-8 min-w-[80px] space-y-2">
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
        <Layers
          layers={layers}
          selectedLayerId={currentLayerId}
          onLayerMove={onLayerMove}
          onSelectLayer={(layerId) => {
            if (typeof controlledLayerId != 'number') {
              setLocalSelectedLayerId(layerId);
            }
            onChangeLayer?.(layerId);
          }}
          onLayerDelete={onLayerDelete}
        />
      </div>
      <Keymap
        keyPositions={keyboard.layouts?.[usedLayout]?.layout}
        keys={layers.find((l) => l.id === currentLayerId)?.keys}
        {...props}
      />
    </div>
  );
};
