'use client';

import { getKeyConfFromDef } from '@/constants';
import { KeymapKeyDef } from '@/types';
import { CSSProperties, useMemo } from 'react';
import { KeyTheme } from '../key';
import { Draggable } from '@/components/0_base/draggable';
import { QMKKey } from '../qmkKey';
import { Droppable } from '@/components/0_base/droppable';

export const Keymap = ({
  keyPositions,
  baseWidth = 36,
  keySepWidth = 6,

  keys,
  currentLayerId,
  layers,

  allowDropKey,
  draggableIdPrefix,
  onKeyClick,
  isKeyDown,
  onKeyUpdate,

  theme,
}: {
  keyPositions: { x: number; y: number; h?: number; w?: number }[];
  baseWidth?: number;
  keySepWidth?: number;
  keys?: KeymapKeyDef[];

  allowDropKey?: boolean;
  onKeyClick?: (arg: { key: KeymapKeyDef | null; index: number }) => void;
  isKeyDown?: (arg: { key: KeymapKeyDef | null; index: number }) => boolean;
  onKeyUpdate?: (arg: {
    prev: KeymapKeyDef | null;
    value: KeymapKeyDef | null;
    index: number;
  }) => void;

  draggableIdPrefix?: string;
  currentLayerId?: string;
  layers?: { id: string; name: string }[];

  theme?: KeyTheme;
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
        const kDef = keys?.[idx];

        const isDown =
          isKeyDown?.({ key: keys?.[idx] ?? null, index: idx }) ?? false;

        const width = (l.w || 1) * baseWidth + ((l.w || 1) - 1) * keySepWidth;
        const height = baseWidth * (l.h || 1);

        const style: CSSProperties = {
          top: l.y * baseWidth + l.y * keySepWidth,
          left: l.x * baseWidth + l.x * keySepWidth,
        };

        const kConf = getKeyConfFromDef(kDef);

        if (isDown) {
          style.marginTop = 6;
          style.paddingBottom = 2;
        }

        return (
          <Draggable
            key={idx}
            id={`${draggableIdPrefix || ''}${idx.toString()}`}
            data={{
              theme,
              kDef,
              width,
              height,
              textSize,
            }}
          >
            {({ isDragging }) => {
              if (allowDropKey) {
                return (
                  <Droppable
                    id={`${draggableIdPrefix || ''}${idx.toString()}`}
                    data={{
                      index: idx,
                      layerId: currentLayerId,
                    }}
                  >
                    {({ isOver }) => (
                      <QMKKey
                        className="absolute"
                        keyDef={kDef}
                        layers={layers}
                        height={height}
                        width={width}
                        isDragging={isDragging}
                        onUpdate={(v) => {
                          onKeyUpdate?.({
                            index: idx,
                            prev: kDef ?? null,
                            value: v,
                          });
                        }}
                        style={style}
                        isDown={isOver || isDown}
                        textSize={textSize}
                        theme={theme}
                        description={kConf?.description}
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
                      />
                    )}
                  </Droppable>
                );
              }
              return (
                <QMKKey
                  className="absolute"
                  keyDef={kDef}
                  layers={layers}
                  height={height}
                  width={width}
                  isDragging={isDragging}
                  onUpdate={(v) => {
                    onKeyUpdate?.({
                      index: idx,
                      prev: kDef ?? null,
                      value: v,
                    });
                  }}
                  style={style}
                  isDown={isDown}
                  textSize={textSize}
                  theme={theme}
                  description={kConf?.description}
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
                />
              );
            }}
          </Draggable>
        );
      })}
    </div>
  );
};
