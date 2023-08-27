'use client';

import { KEYS_MAP } from '@/constants';
import { KEY_TO_TEXT } from '@/lib/keyMapping';
import { KeymapKeyDef } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { CSSProperties, ReactNode, useMemo } from 'react';
import { MOKey } from './customKeys/MO';
import { CustomKeyComponent } from './customKeys/types';

const CUSTOM_KEYS_COMPONENTS: Record<string, CustomKeyComponent> = {
  MO: MOKey,
};

export const Keymap = ({
  keyPositions,
  baseWidth = 36,
  keySepWidth = 6,
  keys,
  layers,

  onKeyClick,
  isKeyDown,
  onKeyUpdate,

  paramsEditable,

  keyColorScheme: { bg: keyBg = 'bg-slate-400', hoverbg = 'bg-slate-500' } = {},
}: {
  keyPositions: { x: number; y: number; h?: number; w?: number }[];
  baseWidth?: number;
  keySepWidth?: number;
  keys?: KeymapKeyDef[];

  onKeyClick?: (arg: { key: KeymapKeyDef | null; index: number }) => void;
  isKeyDown?: (arg: { key: KeymapKeyDef | null; index: number }) => boolean;
  onKeyUpdate?: (arg: {
    prev: KeymapKeyDef | null;
    value: KeymapKeyDef | null;
    index: number;
  }) => void;

  paramsEditable?: boolean;

  layers?: { id: string; name: string }[];

  keyColorScheme?: {
    bg?: string;
    border?: string;
    color?: string;
    hoverbg?: string;
  };
}) => {
  const height = useMemo(() => {
    if (!keyPositions) {
      return 0;
    }
    const height = Math.max(
      0,
      ...keyPositions.map(
        (k) => k.y * baseWidth + k.y * keySepWidth + (k.h || 1) * baseWidth + 10 // padding + border-b
      )
    );
    return height;
  }, [baseWidth, keyPositions, keySepWidth]);

  const width = useMemo(() => {
    if (!keyPositions) {
      return 0;
    }
    const w = Math.max(
      0,
      ...keyPositions.map(
        (k) => k.x * baseWidth + k.x * keySepWidth + (k.w || 1) * baseWidth + 10 // padding + border-b
      )
    );
    return w;
  }, [baseWidth, keyPositions, keySepWidth]);

  const textSize = useMemo(() => {
    if (baseWidth < 26) {
      return 'text-[8px]';
    }
    return 'text-[10px]';
  }, [baseWidth]);

  if (!keyPositions) {
    return null;
  }

  return (
    <div className="relative w-full" style={{ width, height }}>
      {keyPositions.map((l, idx) => {
        let kDef = keys?.[idx];
        let renderedKey: ReactNode;

        if (typeof kDef === 'string') {
          if (kDef in CUSTOM_KEYS_COMPONENTS) {
            const C = CUSTOM_KEYS_COMPONENTS[kDef];
            renderedKey = (
              <C
                params={null}
                layers={layers}
                onUpdate={(v) =>
                  onKeyUpdate?.({
                    index: idx,
                    prev: kDef ?? null,
                    value: v,
                  })
                }
              />
            );
          } else if (kDef in KEY_TO_TEXT) {
            const m = KEY_TO_TEXT[kDef as keyof typeof KEY_TO_TEXT];
            if (typeof m === 'object' && 'icon' in m) {
              renderedKey = <FontAwesomeIcon icon={m.icon} />;
            } else {
              renderedKey = m;
            }
          } else if (kDef in KEYS_MAP) {
            const m = KEYS_MAP[kDef];
            renderedKey = m.title;
          } else {
            renderedKey = kDef;
          }
        } else if (typeof kDef === 'object') {
          if (kDef.key in CUSTOM_KEYS_COMPONENTS) {
            const C = CUSTOM_KEYS_COMPONENTS[kDef.key];
            renderedKey = (
              <C
                params={kDef.params}
                layers={layers}
                onUpdate={(v) =>
                  onKeyUpdate?.({
                    index: idx,
                    prev: kDef ?? null,
                    value: v,
                  })
                }
              />
            );
          } else {
            const m = KEYS_MAP[kDef.key];
            if (m) {
              renderedKey = m.title;
            }
          }
        }

        if (!renderedKey) {
          renderedKey = 'N/A';
        }

        const isDown =
          isKeyDown?.({ key: keys?.[idx] ?? null, index: idx }) ?? false;

        const style: CSSProperties = {
          width: (l.w || 1) * baseWidth + ((l.w || 1) - 1) * keySepWidth,
          height: baseWidth * (l.h || 1),
          boxSizing: 'content-box',
          top: l.y * baseWidth + l.y * keySepWidth,
          left: l.x * baseWidth + l.x * keySepWidth,
        };

        if (isDown) {
          style.marginTop = 6;
          style.paddingBottom = 2;
        }

        return (
          <div
            className={clsx(
              'group absolute select-none cursor-pointer rounded bg-slate-600 p-[2px] pb-[8px] transition-all hover:pb-[6px] active:pb-[2px] hover:mt-[2px] active:mt-[6px]'
            )}
            style={style}
            key={`${l.x}-${l.y}`}
            onClick={
              onKeyClick
                ? () => {
                    onKeyClick({
                      key: keys?.[idx] ?? null,
                      index: idx,
                    });
                  }
                : undefined
            }
          >
            <div
              className={clsx(
                `text-mainbg ${keyBg} whitespace-pre group-hover:${hoverbg} text-center rounded-sm w-full h-full flex items-center justify-center transition`,
                textSize,
                {
                  '': isDown,
                  '': !isDown,
                }
              )}
            >
              {renderedKey}
            </div>
          </div>
        );
      })}
    </div>
  );
};
