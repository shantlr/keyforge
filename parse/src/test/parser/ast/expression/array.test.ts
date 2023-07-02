import { parseC } from '../../../../parser';

describe('parser', () => {
  describe('value expression', () => {
    it('should parse array list', () => {
      const ast = parseC(`{ 1, 2, 3}`, (p) => p.valueExpression());
      expect(ast).toEqual({
        type: 'array',
        values: {
          0: 1,
          1: 2,
          2: 3,
        },
      });
    });
  });
});
