import { useRegisterKey } from '../../providers/keymap';
import { KeysPicker } from '../keysPicker';

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
