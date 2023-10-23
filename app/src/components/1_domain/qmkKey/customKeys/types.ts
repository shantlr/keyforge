import { ComponentProps, FC } from 'react';

import { Key } from '../../key';
import { useOnDrop } from '@/components/0_base/dnd/context';
import { KeyConfig } from '@/constants';
import { KeymapKeyDef, KeymapKeyParam } from '@/types';

export type CustomKeyComponent = FC<
  Omit<ComponentProps<typeof Key>, 'children' | 'onDrop'> & {
    keyConf: KeyConfig;
    params?: KeymapKeyParam[] | null;
    layers?: { id: string; name: string }[];
    onUpdate?: (key: KeymapKeyDef) => void;

    droppableId?: string;
    droppableData?: any;
    droppableDepth?: number;
    onDrop?: Parameters<typeof useOnDrop>[1];
  }
>;

export type CustomKeyProps = ComponentProps<CustomKeyComponent>;
