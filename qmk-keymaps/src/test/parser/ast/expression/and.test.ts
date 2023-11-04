import { parseC } from '../../../../parser';

describe('parser', () => {
  describe('value expression', () => {
    describe('and', () => {
      it('should parse and', () => {
        const ast = parseC(`true && true`, (p) => p.valueExpression());
        expect(ast).toEqual({
          type: 'and',
          values: [true, true],
        });
      });
    });
  });
});
