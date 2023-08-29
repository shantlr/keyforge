import { KeysPicker } from '../keysPicker';
import { useRegisterKey } from './keyContext';

export const ConfiguratorKeyPicker = () => {
  const registerKey = useRegisterKey();

  return (
    <KeysPicker
      onKeyClick={({ key }) => {
        if (key) {
          registerKey?.(key);
        }
      }}
    />
  );
};
