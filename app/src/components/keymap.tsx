'use client';

import { KEY_TO_TEXT } from '@/lib/keyMapping';
import { KeyboardInfo } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';

export const Keymap = ({
  keyboard,
  layout,
  baseWidth = 36,
  keySepWidth = 6,
  keys,
}: {
  keyboard: KeyboardInfo;
  layout: string;
  baseWidth?: number;
  keySepWidth?: number;
  keys?: string[];
}) => {
  if (!keyboard.layouts?.[layout]) {
    return null;
  }

  return (
    <div className="relative">
      {keyboard.layouts[layout].layout.map((l, idx) => {
        let key: string | ReactNode = keys?.[idx] ?? 'N/A';
        if (typeof key === 'string' && key in KEY_TO_TEXT) {
          const m = KEY_TO_TEXT[key as keyof typeof KEY_TO_TEXT];
          if (typeof m === 'object' && 'icon' in m) {
            key = <FontAwesomeIcon icon={m.icon} />;
          } else {
            key = m;
          }
        }

        return (
          <div
            className="group absolute select-none cursor-pointer rounded bg-slate-600 p-[2px] pb-[8px] transition-all hover:pb-[6px] active:pb-[2px] hover:mt-[2px] active:mt-[6px]"
            style={{
              width: (l.w || 1) * baseWidth + ((l.w || 1) - 1) * keySepWidth,
              height: baseWidth * (l.h || 1),
              boxSizing: 'content-box',
              top: l.y * baseWidth + l.y * keySepWidth,
              left: l.x * baseWidth + l.x * keySepWidth,
            }}
            key={`${l.x}-${l.y}`}
          >
            <div className="text-[9px] bg-slate-400 whitespace-pre group-hover:bg-slate-500 text-center rounded-sm w-full h-full flex items-center justify-center transition">
              {key}
            </div>
          </div>
        );
      })}
    </div>
  );
};
