'use client';

import { KEYS, KEYS_MAP, KeyConfig } from '@/constants';
import { KeymapKeyDef } from '@/types';
import clsx from 'clsx';
import { CSSProperties, useMemo } from 'react';
import { CustomKeyComponent } from './customKeys/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
} from '@fortawesome/free-solid-svg-icons';
import { LayerKey } from './customKeys/LayerKey';
import { KeyModifier } from './customKeys/KeyModifier';

const CUSTOM_KEYS_COMPONENTS: Record<string, CustomKeyComponent> = {
  ...KEYS.filter((k) => 'group' in k && k.group === 'layer').reduce(
    (acc, keyConfig) => {
      acc[keyConfig.key] = LayerKey;
      return acc;
    },
    {} as Record<string, CustomKeyComponent>
  ),
  ...KEYS.filter((k) => 'group' in k && k.group === 'modifier').reduce(
    (acc, keyConfig) => {
      acc[keyConfig.key] = KeyModifier;
      return acc;
    },
    {} as Record<string, CustomKeyComponent>
  ),
  KC_UP: () => <FontAwesomeIcon icon={faCaretUp} />,
  KC_DOWN: () => <FontAwesomeIcon icon={faCaretDown} />,
  KC_LEFT: () => <FontAwesomeIcon icon={faCaretLeft} />,
  KC_RGHT: () => <FontAwesomeIcon icon={faCaretRight} />,
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

  const renderKey = (kDef: KeymapKeyDef | null | undefined, index: number) => {
    const params = typeof kDef === 'object' ? kDef?.params : null ?? null;
    const key = typeof kDef === 'string' ? kDef : kDef?.key ?? null;

    const kConf = key ? KEYS_MAP[key] : null;

    const C = kConf?.key ? CUSTOM_KEYS_COMPONENTS[kConf.key] : null;

    if (kConf && C) {
      return (
        <C
          keyConf={kConf as KeyConfig}
          params={params}
          layers={layers}
          onUpdate={(v) =>
            onKeyUpdate?.({
              index,
              prev: kDef ?? null,
              value: v,
            })
          }
        />
      );
    }

    if (kConf?.title) {
      return kConf?.title;
    }
    if (kConf?.key) {
      return kConf.key;
    }

    return 'N/A';
  };

  return (
    <div className="relative w-full" style={{ width, height }}>
      {keyPositions.map((l, idx) => {
        const kDef = keys?.[idx];

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
              {renderKey(kDef, idx)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
