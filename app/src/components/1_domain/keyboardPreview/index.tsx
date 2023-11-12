import clsx from 'clsx';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { $$getKeyboard } from '@/actions/getExisingKeymap';

import { Keymap } from '../keymap';

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
        'border border-gray-700 rounded inline-block  lg:w-[400px] md:w-[350px] sm:w-[280px] h-[200px]',
        className
      )}
    >
      <div className={clsx('px-2 border-b border-gray-800')}>
        <span className="text-sm text-default-darker">{keyboardKey}</span>
        {keyboard?.keyboard_name ? ` - ${keyboard.keyboard_name}` : ''}
      </div>

      <div className="p-2 w-full h-full">
        {isLoading && <span>Loading...</span>}
        {data === null && <span>Keyboard not found</span>}
        {preview && (
          <div className="w-full h-full">
            <Keymap
              keyPositions={preview.keyPositions}
              keys={preview.keys}
              baseWidth={18}
              keySepWidth={5}
            />
          </div>
        )}
        {!preview && keyboard && (
          <span>Keyboard seems to have an invalid info.json</span>
        )}
      </div>
    </div>
  );
};
