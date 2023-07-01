import { parserCFile } from '../../../parser';

describe('parser', () => {
  describe('ast', () => {
    describe('def array', () => {
      it('should parse defined array var', () => {
        const res = parserCFile(`
        const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
          [_DEF] = LAYOUT_all(KC_A, KC_B, KC_C),
          [_FNC] = LAYOUT_all(KC_1, KC_2, KC_3)
        };
        `);
        expect(res).toEqual({
          type: 'statements',
          values: [
            {
              type: 'var',
              const: true,
              varType: 'uint16_t',
              name: 'keymaps',
              modifier: 'PROGMEM',
              arrayDim: null,
              value: {
                type: 'array',
                values: {
                  _DEF: {
                    type: 'postCall',
                    fn: 'LAYOUT_all',
                    calls: [['KC_A', 'KC_B', 'KC_C']],
                  },
                  _FNC: {
                    type: 'postCall',
                    fn: 'LAYOUT_all',
                    calls: [['KC_1', 'KC_2', 'KC_3']],
                  },
                },
              },
            },
          ],
        });
      });
    });
  });
});
