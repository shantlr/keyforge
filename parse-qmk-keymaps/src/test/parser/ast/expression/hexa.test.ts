import { parseC } from '../../../../parser';

describe('parser', () => {
  describe('value expression', () => {
    it('should parse hexa', () => {
      const ast = parseC(`0xFF`, (p) => p.valueExpression());
      expect(ast).toEqual(255);
    });
  });
});
