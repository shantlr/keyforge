import { parserCFile } from '../../../parser';

describe('parser', () => {
  describe('ast', () => {
    describe('def fn', () => {
      it('should parse void fn', () => {
        const res = parserCFile(`
        void keyboard_post_init_user(void) {
          rgb_matrix_enable_noeeprom();
        }
        `);
        expect(res).toEqual({
          type: 'statements',
          values: [
            {
              type: 'fnDef',
              name: 'keyboard_post_init_user',
              params: [],
              returnType: 'void',
              body: [
                {
                  type: 'fnCall',
                  name: 'rgb_matrix_enable_noeeprom',
                  params: [],
                },
              ],
            },
          ],
        });
      });

      it('should parse fn with params', () => {
        const res = parserCFile(`
        void rgb_matrix_indicators_advanced_user(uint8_t led_min, uint8_t led_max) {
        }
        `);
        expect(res).toEqual({
          type: 'statements',
          values: [
            {
              type: 'fnDef',
              name: 'rgb_matrix_indicators_advanced_user',
              returnType: 'void',
              params: [
                {
                  name: 'led_min',
                  varType: 'uint8_t',
                  arrayDim: null,
                  modifier: undefined,
                },
                {
                  name: 'led_max',
                  varType: 'uint8_t',
                  arrayDim: null,
                  modifier: undefined,
                },
              ],
              body: [],
            },
          ],
        });
      });

      it('should parse fn return boolean', () => {
        const res = parserCFile(`
        boolean rgb_matrix_indicators_advanced_user() {
          return true;
        }
        `);
        expect(res).toEqual({
          type: 'statements',
          values: [
            {
              type: 'fnDef',
              name: 'rgb_matrix_indicators_advanced_user',
              returnType: 'boolean',
              params: [],
              body: [
                {
                  type: 'return',
                  value: true,
                },
              ],
            },
          ],
        });
      });
      it('should parse fn return void', () => {
        const res = parserCFile(`
        void rgb_matrix_indicators_advanced_user() {
          return;
        }
        `);
        expect(res).toEqual({
          type: 'statements',
          values: [
            {
              type: 'fnDef',
              name: 'rgb_matrix_indicators_advanced_user',
              returnType: 'void',
              params: [],
              body: [
                {
                  type: 'return',
                  value: undefined,
                },
              ],
            },
          ],
        });
      });

      it('should parse fn if', () => {
        const res = parserCFile(`
        void rgb_matrix_indicators_advanced_user() {
          if (host_keyboard_led_state().caps_lock) {
            RGB_MATRIX_INDICATOR_SET_COLOR(73, 255, 255, 255);
          }
        }
        `);
        expect(res).toEqual({
          type: 'statements',
          values: [
            {
              type: 'fnDef',
              name: 'rgb_matrix_indicators_advanced_user',
              returnType: 'void',
              params: [],
              body: [
                {
                  type: 'if',
                  condition: {
                    type: 'accessField',
                    field: 'caps_lock',
                    value: {
                      type: 'fnCall',
                      name: 'host_keyboard_led_state',
                      params: [],
                    },
                  },
                  do: [
                    {
                      type: 'fnCall',
                      name: 'RGB_MATRIX_INDICATOR_SET_COLOR',
                      params: [73, 255, 255, 255],
                    },
                  ],
                  else: [],
                },
              ],
            },
          ],
        });
      });
    });
  });
});
