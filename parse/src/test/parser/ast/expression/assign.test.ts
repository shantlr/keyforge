import { parseC } from '../../../../parser';

describe('parser', () => {
  describe('value expression', () => {
    it('should parse =', () => {
      const ast = parseC(`test = 1`, (p) => p.valueExpression());
      expect(ast).toEqual({
        type: 'assign',
        values: ['test', 1],
      });
    });
  });
});
