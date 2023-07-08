import { parseC } from '../../../../parser';

describe('parser', () => {
  describe('value expression', () => {
    it('should parse &', () => {
      const ast = parseC(`test & 1`, (p) => p.valueExpression());
      expect(ast).toEqual({
        type: 'bitAnd',
        values: ['test', 1],
      });
    });

    it('should parse a & b & c', () => {
      const ast = parseC(`test & 1 & 2`, (p) => p.valueExpression());
      expect(ast).toEqual({
        type: 'bitAnd',
        values: ['test', 1, 2],
      });
    });
  });
});
