import { parseC } from '../../../../parser';

describe('parser', () => {
  describe('value expression', () => {
    it('should parse ==', () => {
      const ast = parseC(`1 == 2`, (p) => p.valueExpression());
      expect(ast).toEqual({
        type: 'equal',
        values: [1, 2],
      });
    });
  });
});
