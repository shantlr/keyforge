import { Select } from '@/components/0_base/select';
import { Item } from 'react-stately';
import { CustomKeyComponent } from './types';

export const LayerKey: CustomKeyComponent = ({
  keyConf,
  params,
  layers,
  onUpdate,
}) => {
  return (
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
          selectedKey={params?.[0]?.value ?? null}
          inputClassName="text-[8px]"
          onSelectionChange={(k) => {
            onUpdate?.({
              key: keyConf.key,
              params: [{ type: 'layer', value: k as string }],
            });
          }}
        >
          {layers.map((l) => (
            <Item key={l.id}>{l.name}</Item>
          ))}
        </Select>
      )}
    </div>
  );
};
