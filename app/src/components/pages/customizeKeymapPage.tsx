'use client';

import { useState } from 'react';

import { KeymapConfigurator } from '@/components/2_controlled/keymapConfigurator';
import { ExistingKeymap } from '@/lib/keyboards';
import { KeyboardInfo } from '@/types';

export const CustomizeKeymapPage = ({
  keyboardKey,
  keyboard,
  keymaps,
}: {
  keyboardKey: string;
  keyboard: KeyboardInfo;
  keymaps: ExistingKeymap[];
}) => {
  const [selectedKeymapId, setSelectedKeymapId] = useState<string | null>(null);

  return (
    <div className="expanded-container">
      <KeymapConfigurator
        keyboardKey={keyboardKey}
        keyboard={keyboard}
        keymaps={keymaps}
        onSelectKeymap={setSelectedKeymapId}
      />
    </div>
  );
};
