'use client';

import { Button } from '@/components/0_base/button';
import { KeyforgeSteps } from '@/components/1_domain/keyforgeSteps';
import { KeymapConfigurator } from '@/components/2_controlled/keymapConfigurator';
import { ExistingKeymap } from '@/lib/keyboards';
import { KeyboardInfo } from '@/types';
import Link from 'next/link';
import { useState } from 'react';

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
    <>
      <div className="flex justify-center pt-8">
        <KeyforgeSteps
          current="customize"
          compile={
            selectedKeymapId ? (
              <Link href={`${keyboardKey}/compile`}>
                {' '}
                <Button>Compile firmware</Button>
              </Link>
            ) : undefined
          }
        />
      </div>
      <div className="expanded-container mt-8">
        <KeymapConfigurator
          keyboardKey={keyboardKey}
          keyboard={keyboard}
          keymaps={keymaps}
          onSelectKeymap={setSelectedKeymapId}
        />
      </div>
    </>
  );
};
