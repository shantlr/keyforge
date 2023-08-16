import { toLower } from 'lodash';
import { formatNode } from './core/formatNode';
import { StatementsNode, ValueExprNode } from './core/types';

export const formatKeymap = ({
  keyboardName,
  layers,
  layout,
}: {
  keyboardName: string;
  layout: string;
  layers: {
    name: string;
    keys: string[];
  }[];
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
        name: `${toLower(keyboardName).replace(/\//g, '_')}_layers`,
        values: layers.map((l, idx) => ({
          name: `LAYER_${l.name}`,
          value: undefined,
          // value: idx === 0 ? 'SAFE_RANGE' : undefined,
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
              const layerName = `LAYER_${layer.name}`;
              acc[layerName] = {
                type: 'postCall',
                fn: layout,
                calls: [layer.keys],
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
