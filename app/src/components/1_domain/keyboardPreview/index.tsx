import clsx from 'clsx';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { Keymap } from '../keymap';
import { $$getKeyboard } from '@/actions/getExisingKeymap';

export const KeyboardPreview = ({
  keyboardKey,
  className,
}: {
  keyboardKey: string;
  className?: string;
}) => {
  const { data, isLoading } = useQuery(['keyboard', keyboardKey], () =>
    $$getKeyboard({ keyboardKey })
  );

  const { keyboard, keymap } = data || {};

  const preview = useMemo(() => {
    if (!keyboard?.layouts || !keymap) {
      return null;
    }

    if (keymap.layout in keyboard.layouts) {
      return {
        keyPositions: keyboard.layouts[keymap.layout]?.layout,
        keys: keymap.layers[0].keys,
      };
    }
    const layout =
      keymap.layout in keyboard.layouts
        ? keymap.layout
        : Object.keys(keyboard.layouts)[0];
    if (!layout) {
      return null;
    }

    return {
      keyPositions: keyboard.layouts[layout]?.layout,
      keys: undefined,
    };
  }, [keyboard, keymap]);

  return (
    <div
      className={clsx(
        'border border-gray-700 rounded inline-block min-w-[400px]',
        className
      )}
    >
      <div className={clsx('px-2 border-b border-gray-800')}>
        <span className="text-sm text-default-darker">{keyboardKey}</span>
        {keyboard?.keyboard_name ? ` - ${keyboard.keyboard_name}` : ''}
      </div>
      <div className="p-2">
        {isLoading && <span>Loading...</span>}
        {data === null && <span>Keyboard not found</span>}
        {preview && (
          <Keymap
            keyPositions={preview.keyPositions}
            keys={preview.keys}
            baseWidth={18}
            keySepWidth={5}
          />
        )}
        {!preview && keyboard && (
          <span>Keyboard seems to have an invalid info.json</span>
        )}
      </div>
    </div>
  );
};
