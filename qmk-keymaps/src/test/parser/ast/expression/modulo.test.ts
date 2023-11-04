import { parseC } from '../../../../parser';

describe('parser', () => {
  describe('value expression', () => {
    it('should parse %', () => {
      const ast = parseC(`6 % 2`, (p) => p.valueExpression());
      expect(ast).toEqual({
        type: 'modulo',
        values: [6, 2],
      });
    });
  });
});
