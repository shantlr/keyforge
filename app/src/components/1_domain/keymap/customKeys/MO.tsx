import { Select } from '@/components/0_base/select';
import { Item } from 'react-stately';
import { CustomKeyComponent } from './types';

export const MOKey: CustomKeyComponent = ({ params, layers, onUpdate }) => {
  return (
    <div className="overflow-hidden flex flex-col items-center">
      <div className="text-[9px]">Push to</div>
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
          onSelectionChange={(k) => {
            onUpdate?.({
              key: 'MO',
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
