'use client';

import { KeyboardInfo } from '@/types';

export const Keymap = ({
  keyboard,
  layout,
  baseWidth = 26,
  keySepWidth = 6,
}: {
  keyboard: KeyboardInfo;
  layout: string;
  baseWidth?: number;
  keySepWidth?: number;
}) => {
  if (!keyboard.layouts[layout]) {
    return null;
  }

  return (
    <div className="relative">
      {keyboard.layouts[layout].layout.map((l) => (
        <div
          className="group absolute select-none cursor-pointer rounded bg-slate-600 p-[2px] pb-[8px] transition hover:pb-[6px] active:pb-[2px] hover:mt-[2px] active:mt-[6px]"
          style={{
            width: (l.w || 1) * baseWidth + ((l.w || 1) - 1) * keySepWidth,
            height: baseWidth,
            boxSizing: 'content-box',
            top: l.y * baseWidth + l.y * keySepWidth,
            left: l.x * baseWidth + l.x * keySepWidth,
          }}
          key={`${l.x}-${l.y}`}
        >
          <div className="bg-slate-400 group-hover:bg-slate-500 rounded-sm w-full h-full flex items-center justify-center transition">
            A
          </div>
        </div>
      ))}
    </div>
  );
};
