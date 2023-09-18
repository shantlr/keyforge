import { toLower } from 'lodash';
import { formatNode } from './core/formatNode';
import { StatementsNode, ValueExprNode } from './core/types';
import { KeyInput, KeymapInput } from '../types';

const formatKeymapName = (name: string) => {
  return toLower(name)
    .replace(/\//g, '_')
    .replace(/ /g, '_')
    .replace(/[^0-9a-z-_]/gi, '');
};

const formatLayerName = (layerName: string) => {
  const normalized = layerName.replace(/ |-/g, '_').replace(/[^0-9a-z_]/gi, '');
  return `LAYER_${normalized}`;
};

export const formatKey = (
  key: KeyInput,
  { layers }: { layers: KeymapInput['layers'] },
): ValueExprNode => {
  if (typeof key === 'string') {
    return key;
  }

  if (typeof key === 'object') {
    return {
      type: 'postCall',
      fn: key.key,
      calls: [
        key.params.map((param) => {
          if (param.type === 'layer') {
            const layer = layers.find((l) => l.id === param.value);
            return formatLayerName(layer.name);
          }

          if (param.type === 'key') {
            return formatKey(param.value, { layers });
          }

          throw new Error(`Unhandled key param: ${JSON.stringify(param)}`);
        }),
      ],
    };
  }

  throw new Error(`Unhandled key: ${JSON.stringify(key)}`);
};

export const formatKeymap = ({
  keyboardName,
  layers,
  layout,
}: {
  keyboardName: string;
  layout: string;
  layers: KeymapInput['layers'];
}) => {
  if (!layers.length) {
    throw new Error('LAYERS_CANNOT_BE_EMPTY');
  }

  const res: StatementsNode = {
    type: 'statements',
    values: [
      {
        type: 'include',
        value: 'QMK_KEYBOARD_H',
      },
      {
        type: 'enum',
        name: `${formatKeymapName(keyboardName)}_layers`,
        values: layers.map((l) => ({
          name: formatLayerName(l.name),
          value: undefined,
        })),
      },
      {
        type: 'var',
        name: 'keymaps',
        modifier: 'PROGMEM',
        const: true,
        varType: 'uint16_t',
        arrayDim: [{}, { value: 'MATRIX_ROWS' }, { value: 'MATRIX_COLS' }],
        value: {
          type: 'array',
          values: layers.reduce(
            (acc, layer) => {
              const layerName = formatLayerName(layer.name);
              acc[layerName] = {
                type: 'postCall',
                fn: layout,
                calls: [
                  layer.keys.map((k) => {
                    return formatKey(k, { layers });
                  }),
                ],
              };
              return acc;
            },
            {} as Record<string, ValueExprNode>,
          ),
        },
      },
    ],
  };

  const outputFile = formatNode(res);
  return outputFile;
};
