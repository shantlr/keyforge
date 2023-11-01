import { forwardRef } from 'react';
import { Item } from 'react-stately';

import { Select } from '@/components/0_base/select';
import { useRegisterHighlightedLayer } from '@/components/providers/keymap';

import { Key } from '../../key';

import { CustomKeyProps } from './types';

export const LayerKey = forwardRef<any, CustomKeyProps>(
  (
    {
      keyConf,
      params,
      layers,
      onUpdate,
      droppableId,
      droppableData,
      onDrop,
      droppableDepth,

      ...props
    },
    ref
  ) => {
    const layerId = params?.[0]?.value as string | undefined;
    const registerHighlightedLayer = useRegisterHighlightedLayer();

    return (
      <Key
        {...props}
        ref={ref}
        onMouseEnter={() => {
          registerHighlightedLayer(layerId);
        }}
        onMouseLeave={() => {
          registerHighlightedLayer(undefined);
        }}
      >
        <div className="overflow-hidden flex flex-col items-center">
          <div className="text-[9px]">{keyConf.title || keyConf.key}</div>
          {!layers?.length && (
            <div className="text-[9px] border border-dashed px-1 mx-[1px] rounded-sm border-secondary text-secondary">
              Layer
            </div>
          )}
          {layers?.length && (
            <Select
              colorScheme="secondary"
              placeholder="Layer"
              size="sm"
              selectedKey={(params?.[0]?.value as string) ?? null}
              inputClassName="text-[8px]"
              onSelectionChange={(k) => {
                onUpdate?.({
                  key: keyConf.key,
                  params: [{ type: 'layer', value: k as string }],
                });
              }}
              aria-label="select layer"
            >
              {layers.map((l) => (
                <Item key={l.id} aria-label={l.name}>
                  {l.name}
                </Item>
              ))}
            </Select>
          )}
        </div>
      </Key>
    );
  }
);
LayerKey.displayName = 'LayerKey';
