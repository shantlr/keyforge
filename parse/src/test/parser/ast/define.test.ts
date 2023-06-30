import { parserCFile } from '../../../parser';

describe('parser', () => {
  describe('ast', () => {
    describe('define', () => {
      it('should parse empty define', () => {
        const res = parserCFile(`#define TEST`);
        expect(res).toEqual({
          type: 'statements',
          values: [{ type: 'define', name: 'TEST', value: null }],
        });
      });

      it('should parse define fnCall', () => {
        const res = parserCFile(`#define TEST FN(ARG)`);
        expect(res).toEqual({
          type: 'statements',
          values: [
            {
              type: 'define',
              name: 'TEST',
              value: {
                type: 'fnCall',
                name: 'FN',
                params: ['ARG'],
              },
            },
          ],
        });
      });
    });
  });
});
