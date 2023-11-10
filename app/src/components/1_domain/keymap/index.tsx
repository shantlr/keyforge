'use client';

import { CSSProperties, useId, useMemo, useState } from 'react';

import { Draggable } from '@/components/0_base/draggable';
import { getKeyConfFromDef } from '@/constants';
import { useElemSize } from '@/hooks/useElemSize';
import { KeymapKeyDef } from '@/types';

import { KeyTheme } from '../key';
import { QMKKey } from '../qmkKey';

export const Keymap = ({
  keyPositions,
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
  const localId = useId();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const containerSize = useElemSize(container);

  const xUnit = useMemo(() => {
    if (!keyPositions) {
      return 0;
    }
    return Math.max(...keyPositions.map((k) => k.x + (k.w || 1)));
  }, [keyPositions]);
  const yUnit = useMemo(() => {
    if (!keyPositions) {
      return 0;
    }
    return Math.max(...keyPositions.map((k) => k.y + (k.h || 1)));
  }, [keyPositions]);

  // Auto detech key width based on available space
  const baseWidth = useMemo(() => {
    if (!containerSize.width || !containerSize.height) {
      return 0;
    }

    const w = Math.min(
      (containerSize.width - 10) / xUnit - keySepWidth,
      (containerSize.height - 10) / yUnit - keySepWidth,
      40
    );
    return w;
  }, [containerSize, keySepWidth, xUnit, yUnit]);

  const textSize = useMemo(() => {
    if (baseWidth <= 18) {
      return 'text-[5px]';
    }
    if (baseWidth <= 22) {
      return 'text-[6px]';
    }
    if (baseWidth < 26) {
      return 'text-[8px]';
    }
    return 'text-[10px]';
  }, [baseWidth]);

  if (!keyPositions) {
    return null;
  }

  return (
    <div
      ref={setContainer}
      className="relative w-full h-full grow"
      data-blur-key-down
    >
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
              type: 'key',
              keyDef: kDef,
              theme,
              width,
              height,
              textSize,

              keymapKeyIndex: idx,
              keymapLocalId: localId,
            }}
          >
            {() => {
              return (
                <QMKKey
                  className="absolute"
                  keyDef={kDef}
                  layers={layers}
                  height={height}
                  width={width}
                  droppableId={
                    allowDropKey
                      ? `${draggableIdPrefix || ''}${idx}`
                      : undefined
                  }
                  droppableData={
                    allowDropKey
                      ? {
                          type: 'droppable-key',
                          index: idx,
                          layerId: currentLayerId,
                        }
                      : undefined
                  }
                  onDrop={
                    allowDropKey
                      ? (e) => {
                          const { active } = e.data;
                          e.stopPropagation();
                          const dropped = active.data.current as any;
                          if (dropped?.type === 'key') {
                            onKeyUpdate?.({
                              index: idx,
                              prev: kDef ?? null,
                              value: dropped.keyDef,
                            });
                          }
                        }
                      : undefined
                  }
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
