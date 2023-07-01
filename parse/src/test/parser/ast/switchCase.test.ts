import { parseC } from '../../../parser';

describe('parse', () => {
  describe('ast', () => {
    describe('switch case', () => {
      it('should parse switch case with default', () => {
        const res = parseC(`
          bool music_mask_user() {
            switch (keycode) {
              case RAISE:
              case LOWER:
                return false;
              default:
                return true;
            }
          }
        `);
        expect(res).toEqual({
          type: 'statements',
          values: [
            {
              type: 'fnDef',
              name: 'music_mask_user',
              params: [],
              returnType: 'bool',
              body: [
                {
                  type: 'switch',
                  value: 'keycode',
                  cases: [
                    {
                      matches: ['RAISE', 'LOWER'],
                      default: false,
                      do: [
                        {
                          type: 'return',
                          value: false,
                        },
                      ],
                    },
                    {
                      default: true,
                      matches: [],
                      do: [
                        {
                          type: 'return',
                          value: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });
      });
    });
  });
});
