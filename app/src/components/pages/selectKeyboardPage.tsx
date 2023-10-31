'use client';
import { useState } from 'react';

import { KeyboardPreview } from '../1_domain/keyboardPreview';
import { SelectKeyboard } from '@/components/1_domain/selectKeybard';
import { UserKeyboards } from '@/components/1_domain/userKeyboards';

export const SelectKeyboardPage = ({
  keyboards,
}: {
  keyboards: { name: string; key: string; qmkpath: string }[];
}) => {
  const [keyboardKey, setKeyboardKey] = useState<string | undefined>(undefined);

  return (
    <div className="px-16 flex grow w-full h-full overflow-hidden">
      <SelectKeyboard
        className="ml-2 max-w-[500px]"
        keyboards={keyboards}
        onKeyboardHover={(kb) => setKeyboardKey(kb.key)}
      />
      <div className="pl-12 w-full">
        <UserKeyboards onKeyboardHover={(key) => setKeyboardKey(key)} />
        {keyboardKey && (
          <KeyboardPreview className="mt-4" keyboardKey={keyboardKey} />
        )}
      </div>
    </div>
  );
};
