import { parseC } from '../../../parser';

describe('parser', () => {
  describe('ast', () => {
    describe('define', () => {
      it('should parse empty define', () => {
        const res = parseC(`#define TEST`);
        expect(res).toEqual({
          type: 'statements',
          values: [{ type: 'define', name: 'TEST', value: null }],
        });
      });

      it('should parse define fnCall', () => {
        const res = parseC(`#define TEST FN(ARG)`);
        expect(res).toEqual({
          type: 'statements',
          values: [
            {
              type: 'define',
              name: 'TEST',
              value: {
                type: 'postCall',
                fn: 'FN',
                calls: [['ARG']],
              },
            },
          ],
        });
      });

      it('should parse ifdef', () => {
        const res = parseC(`
          #ifdef TEST
          int var = 1;
          #endif
        `);
        expect(res).toEqual({
          type: 'statements',
          values: [
            {
              type: 'preprocIf',
              condition: 'TEST',
              value: [
                {
                  type: 'var',
                  varType: 'int',
                  modifier: undefined,
                  arrayDim: null,
                  const: false,
                  name: 'var',
                  value: 1,
                },
              ],
            },
          ],
        });
      });
      it('should parse if defined', () => {
        const res = parseC(`
          #if defined(TEST)
          int var = 1;
          #endif
        `);
        expect(res).toEqual({
          type: 'statements',
          values: [
            {
              type: 'preprocIf',
              condition: {
                type: 'postCall',
                fn: 'defined',
                calls: [['TEST']],
              },
              value: [
                {
                  type: 'var',
                  varType: 'int',
                  modifier: undefined,
                  arrayDim: null,
                  const: false,
                  name: 'var',
                  value: 1,
                },
              ],
            },
          ],
        });
      });
    });
  });
});
