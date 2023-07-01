import { parseC } from '../../../parser';

describe('parser', () => {
  describe('ast', () => {
    describe('include', () => {
      it('should parse enum', () => {
        const res = parseC(`enum test {
          VAL_1,
          VAL_2,
          VAL_3
        };`);
        expect(res).toEqual({
          type: 'statements',
          values: [
            {
              type: 'enum',
              name: 'test',
              values: [
                { name: 'VAL_1', value: 0 },
                { name: 'VAL_2', value: 1 },
                { name: 'VAL_3', value: 2 },
              ],
            },
          ],
        });
      });
    });
  });
});
