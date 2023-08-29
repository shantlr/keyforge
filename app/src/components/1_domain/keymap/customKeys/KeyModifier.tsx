import { Button } from '@/components/0_base/button';
import { CustomKeyComponent } from './types';

export const KeyModifier: CustomKeyComponent = ({
  keyConf,
  params,
  onUpdate,
}) => {
  return (
    <div className="overflow-hidden flex flex-col items-center">
      <div className="text-[9px]">{keyConf.title || keyConf.key}</div>
      <Button size="sm" colorScheme="secondary" className="text-[8px]">
        Key
      </Button>
    </div>
  );
};
